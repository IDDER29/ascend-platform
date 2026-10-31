#define _DEFAULT_SOURCE
#include <stdio.h>
#include <sys/mman.h>
#include <time.h>

#define PAGE 4096L
#define READS (64L * 1024 * 1024)
#define MAX_PAGES 32768L /* 128 MiB of address space */

static double now(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &t);
    return t.tv_sec + t.tv_nsec / 1e9;
}

/* Which of a page's 64 cache lines to read: a hash of the page number, so the
   lines land all over the cache instead of piling into a few of its sets. */
static long line_of(long p) {
    return (long) (((unsigned long long) p * 0x9E3779B97F4A7C15ULL) >> 58);
}

/* Read one cache line from each of `pages` pages, round and round. Each page
   contributes exactly one line, so even 32768 pages are only 2 MiB of data:
   what grows is the number of different pages, which the TLB must cover. */
static double ns_per_read(volatile unsigned char *mem, long pages) {
    unsigned sum = 0;
    double start = now();
    long p = 0;
    for (long i = 0; i < READS; i++) {
        sum += mem[p * PAGE + line_of(p) * 64];
        p = (p + 1 == pages) ? 0 : p + 1;
    }
    double elapsed = now() - start;
    if (sum == 1) {
        printf("(never printed)\n");
    }
    return elapsed * 1e9 / READS;
}

static void run(const char *label, int advice) {
    unsigned char *mem = mmap(NULL, MAX_PAGES * PAGE, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    if (mem == MAP_FAILED) {
        perror("mmap");
        return;
    }
    madvise(mem, MAX_PAGES * PAGE, advice);
    for (long i = 0; i < MAX_PAGES * PAGE; i += PAGE) {
        mem[i] = 1; /* fault every page in first, so no page faults are timed */
    }
    printf("%s\n", label);
    long sizes[] = {16, 64, 512, 2048, 8192, 32768};
    for (size_t k = 0; k < sizeof sizes / sizeof sizes[0]; k++) {
        printf("  %6ld pages: %5.2f ns per read\n", sizes[k], ns_per_read(mem, sizes[k]));
    }
    munmap(mem, MAX_PAGES * PAGE);
}

int main(void) {
    run("4 KiB pages:", MADV_NOHUGEPAGE);
    run("2 MiB huge pages, where the kernel can give them:", MADV_HUGEPAGE);
    return 0;
}
