#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define LEN (8 * 1024 * 1024) /* 8 Mi ints: 32 MiB */
#define RUNS 15

static double now(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &t);
    return (double) t.tv_sec + (double) t.tv_nsec / 1e9;
}

/* Square root by Newton's method, so the program needs no maths library. */
static double root(double v) {
    double x = v > 1 ? v : 1;
    for (int i = 0; i < 60; i++) {
        x = 0.5 * (x + v / x);
    }
    return x;
}

static int by_value(const void *a, const void *b) {
    double x = *(const double *) a, y = *(const double *) b;
    return (x > y) - (x < y);
}

int main(void) {
    int *a = malloc(LEN * sizeof *a); /* reserved, but no page is really there until first written */
    if (a == NULL) {
        return 1;
    }
    double ms[RUNS];
    long long check = 0;
    for (int r = 0; r < RUNS; r++) {
        double start = now();
        for (int i = 0; i < LEN; i++) {
            a[i] = i ^ r;
        }
        long long s = 0;
        for (int i = 0; i < LEN; i++) {
            s += a[i];
        }
        ms[r] = (now() - start) * 1000.0;
        check += s;
    }
    printf("run times (ms):");
    for (int r = 0; r < RUNS; r++) {
        printf(" %.1f", ms[r]);
    }
    printf("\n");

    double sum = 0, sum_rest = 0;
    for (int r = 0; r < RUNS; r++) {
        sum += ms[r];
        if (r > 0) {
            sum_rest += ms[r];
        }
    }
    double mean = sum / RUNS;
    double var = 0;
    for (int r = 0; r < RUNS; r++) {
        var += (ms[r] - mean) * (ms[r] - mean);
    }
    double sorted[RUNS];
    for (int r = 0; r < RUNS; r++) {
        sorted[r] = ms[r];
    }
    qsort(sorted, RUNS, sizeof sorted[0], by_value);
    printf("mean %.1f, median %.1f, min %.1f, max %.1f, std dev %.1f\n", mean, sorted[RUNS / 2], sorted[0], sorted[RUNS - 1],
           root(var / (RUNS - 1)));
    printf("mean without the first run: %.1f\n", sum_rest / (RUNS - 1));
    printf("(checksum %lld)\n", check);
    free(a);
    return 0;
}
