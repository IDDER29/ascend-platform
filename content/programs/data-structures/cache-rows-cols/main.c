#define _POSIX_C_SOURCE 200809L /* for clock_gettime, which is POSIX, not standard C */
#include <stdio.h>
#include <time.h>

#define N 2048

static int grid[N][N]; /* 16 MB, stored row after row */

static double now(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &t);
    return (double) t.tv_sec + (double) t.tv_nsec / 1e9;
}

int main(void) {
    for (int r = 0; r < N; r++)
        for (int c = 0; c < N; c++) grid[r][c] = (r + c) & 7;

    double t0 = now();
    long by_rows = 0;
    for (int r = 0; r < N; r++)
        for (int c = 0; c < N; c++) by_rows += grid[r][c]; /* next element: 4 bytes on */
    double t1 = now();
    long by_cols = 0;
    for (int c = 0; c < N; c++)
        for (int r = 0; r < N; r++) by_cols += grid[r][c]; /* next element: 8 KB on */
    double t2 = now();

    printf("row order:    sum %ld in %6.1f ms\n", by_rows, (t1 - t0) * 1000);
    printf("column order: sum %ld in %6.1f ms\n", by_cols, (t2 - t1) * 1000);
    return 0;
}
