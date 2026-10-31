#define _POSIX_C_SOURCE 200809L
#include <stdint.h>
#include <stdio.h>
#include <time.h>

#define SLICES 12
#define STEPS 4000000ULL /* the same amount of work in every slice */

static double now(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &t);
    return (double) t.tv_sec + (double) t.tv_nsec / 1e9;
}

int main(void) {
    volatile uint64_t x = 1; /* volatile: every step really happens, one after another */
    printf("slice  time for the same work\n");
    for (int s = 0; s < SLICES; s++) {
        double start = now();
        for (uint64_t i = 0; i < STEPS; i++) {
            x = x * 3 + 1;
        }
        printf("%5d  %6.2f ms\n", s + 1, (now() - start) * 1000.0);
    }
    return 0;
}
