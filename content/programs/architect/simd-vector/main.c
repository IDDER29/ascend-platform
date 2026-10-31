/* y = a*x + y over 4096 floats ("saxpy"), repeated 100000 times, timed. The same source is built
   twice: once with vectorisation turned off, once letting gcc use the CPU's widest vectors. */
#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <time.h>

#define LEN 4096
#define REPEAT 100000

static float x[LEN], y[LEN];

__attribute__((noinline)) static void saxpy(float a, const float *restrict xs, float *restrict ys, int n) {
    for (int i = 0; i < n; i++) {
        ys[i] = a * xs[i] + ys[i];
    }
}

int main(void) {
    for (int i = 0; i < LEN; i++) {
        x[i] = (float) (i % 7);
        y[i] = 0.0f;
    }
    struct timespec t0, t1;
    clock_gettime(CLOCK_MONOTONIC, &t0);
    for (int r = 0; r < REPEAT; r++) {
        saxpy(0.5f, x, y, LEN);
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    double ms = (double) (t1.tv_sec - t0.tv_sec) * 1e3 + (double) (t1.tv_nsec - t0.tv_nsec) / 1e6;
    printf("%d multiply-adds in %.1f ms: %.2f per nanosecond\n", LEN * REPEAT, ms, (double) LEN * REPEAT / (ms * 1e6));
    printf("check: y[1] = %.1f, y[6] = %.1f\n", y[1], y[6]);
    return 0;
}
