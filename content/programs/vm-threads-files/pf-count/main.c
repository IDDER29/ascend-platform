#define _DEFAULT_SOURCE
#include <stdio.h>
#include <sys/mman.h>
#include <sys/resource.h>

#define PAGE 4096L
#define PAGES 1000L

static long minor_faults(void) {
    struct rusage u;
    getrusage(RUSAGE_SELF, &u);
    return u.ru_minflt;
}

int main(void) {
    /* Ask for 1000 pages of fresh memory (and no huge pages, so each 4 KiB page counts). */
    char *mem = mmap(NULL, PAGES * PAGE, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    if (mem == MAP_FAILED) {
        perror("mmap");
        return 1;
    }
    madvise(mem, PAGES * PAGE, MADV_NOHUGEPAGE);

    long before = minor_faults();
    for (long i = 0; i < PAGES * PAGE; i += PAGE) {
        mem[i] = 1; /* first write to each page */
    }
    long after_first = minor_faults();
    for (long i = 0; i < PAGES * PAGE; i += PAGE) {
        mem[i + 1] = 2; /* second write to the same pages */
    }
    long after_second = minor_faults();
    printf("writing 1 byte in each of %ld new pages: %ld faults\n", PAGES, after_first - before);
    printf("writing to the same pages again: %ld faults\n", after_second - after_first);
    munmap(mem, PAGES * PAGE);
    return 0;
}
