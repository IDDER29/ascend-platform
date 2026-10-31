#define _DEFAULT_SOURCE
#include <stdio.h>
#include <sys/mman.h>
#include <sys/resource.h>
#include <sys/wait.h>
#include <unistd.h>

#define PAGE 4096L
#define PAGES 1000L

static long minor_faults(void) {
    struct rusage u;
    getrusage(RUSAGE_SELF, &u);
    return u.ru_minflt;
}

int main(void) {
    char *mem = mmap(NULL, PAGES * PAGE, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    if (mem == MAP_FAILED) {
        perror("mmap");
        return 1;
    }
    madvise(mem, PAGES * PAGE, MADV_NOHUGEPAGE);
    for (long i = 0; i < PAGES * PAGE; i += PAGE) {
        mem[i] = 'p'; /* the parent fills all 1000 pages */
    }

    pid_t pid = fork();
    if (pid == 0) {
        long start = minor_faults();
        long sum = 0;
        for (long i = 0; i < PAGES * PAGE; i += PAGE) {
            sum += mem[i]; /* the child reads all 1000 pages */
        }
        long after_reads = minor_faults();
        for (long i = 0; i < 500 * PAGE; i += PAGE) {
            mem[i] = 'c'; /* then writes to the first 500 */
        }
        long after_writes = minor_faults();
        printf("child: reading 1000 shared pages: %ld faults\n", after_reads - start);
        printf("child: writing 500 of them: %ld faults\n", after_writes - after_reads);
        printf("child sees '%c' in page 0\n", mem[0]);
        (void) sum;
        fflush(stdout);
        _exit(0);
    }
    waitpid(pid, NULL, 0);
    printf("parent still sees '%c' in page 0\n", mem[0]);
    munmap(mem, PAGES * PAGE);
    return 0;
}
