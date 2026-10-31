#define _DEFAULT_SOURCE
#include <stdio.h>
#include <sys/mman.h>
#include <unistd.h>

int main(void) {
    long page = sysconf(_SC_PAGESIZE);
    /* Reserve two pages, then make the second one a guard page: no access at all. */
    char *p = mmap(NULL, 2 * page, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    if (p == MAP_FAILED || mprotect(p + page, page, PROT_NONE) != 0) {
        perror("setup");
        return 1;
    }
    p[99] = 'a';
    printf("byte 99: fine\n");
    p[page - 1] = 'b'; /* the last byte of the first page */
    printf("byte %ld: fine\n", page - 1);
    fflush(stdout);
    p[page] = 'c'; /* the first byte of the guard page */
    printf("byte %ld: never printed\n", page);
    return 0;
}
