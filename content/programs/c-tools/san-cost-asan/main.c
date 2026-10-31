#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
    enum { N = 1 << 22 };
    int *a = malloc(N * sizeof *a);
    if (a == NULL) {
        return 1;
    }
    struct timespec t0, t1;
    clock_gettime(CLOCK_MONOTONIC, &t0);
    long sum = 0;
    for (int round = 0; round < 20; round++) {
        for (int i = 0; i < N; i++) {
            a[i] = i ^ round;
            sum += a[i];
        }
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    double ms = (t1.tv_sec - t0.tv_sec) * 1e3 + (t1.tv_nsec - t0.tv_nsec) / 1e6;
    printf("sum %ld in %.1f ms\n", sum, ms);
    free(a);
    return 0;
}
