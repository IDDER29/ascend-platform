#define _POSIX_C_SOURCE 200809L
#include <stdint.h>
#include <stdio.h>
#include <time.h>
#include <x86intrin.h>

#define LEN 16384  /* 64 KiB of numbers: small enough to stay in the caches */
#define REPEAT 5000

static unsigned data[LEN];

/* noipa: compiled on its own, so gcc can't see it returns the same sum 5000 times. */
__attribute__((noipa)) static unsigned sum(const unsigned *a, int n) {
    unsigned s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}

int main(void) {
    for (int i = 0; i < LEN; i++) {
        data[i] = (unsigned) i;
    }
    struct timespec t0, t1;
    unsigned total = 0;
    clock_gettime(CLOCK_MONOTONIC, &t0);
    uint64_t c0 = __rdtsc();
    for (int r = 0; r < REPEAT; r++) {
        total += sum(data, LEN);
    }
    uint64_t c1 = __rdtsc();
    clock_gettime(CLOCK_MONOTONIC, &t1);
    double secs = (double) (t1.tv_sec - t0.tv_sec) + (double) (t1.tv_nsec - t0.tv_nsec) / 1e9;
    double elements = (double) LEN * REPEAT;
    printf("total:                %u\n", total);
    printf("elements added:       %.0f million\n", elements / 1e6);
    printf("time:                 %.3f s\n", secs);
    printf("TSC ticks per element: %.2f\n", (double) (c1 - c0) / elements);
    printf("TSC rate:             %.2f GHz\n", (double) (c1 - c0) / secs / 1e9);
    return 0;
}
