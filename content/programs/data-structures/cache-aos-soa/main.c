#define _POSIX_C_SOURCE 200809L /* for clock_gettime, which is POSIX, not standard C */
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define N 2000000

/* An array of structs: each particle's fields sit together (64 bytes each). */
struct particle {
    double x, y, z;
    double vx, vy, vz;
    double mass;
    long id;
};

/* A struct of arrays: each field has its own array. */
struct particles {
    double *x, *y, *z, *vx, *vy, *vz, *mass;
    long *id;
};

static double now(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &t);
    return (double) t.tv_sec + (double) t.tv_nsec / 1e9;
}

int main(void) {
    struct particle *aos = malloc(sizeof *aos * N);
    struct particles soa = {
        malloc(sizeof(double) * N), malloc(sizeof(double) * N), malloc(sizeof(double) * N),
        malloc(sizeof(double) * N), malloc(sizeof(double) * N), malloc(sizeof(double) * N),
        malloc(sizeof(double) * N), malloc(sizeof(long) * N),
    };
    if (!aos || !soa.x || !soa.y || !soa.z || !soa.vx || !soa.vy || !soa.vz || !soa.mass || !soa.id) return 1;
    for (int i = 0; i < N; i++) {
        aos[i] = (struct particle){i % 10, 0, 0, 0, 0, 0, 1, i};
        soa.x[i] = i % 10;
        soa.y[i] = soa.z[i] = soa.vx[i] = soa.vy[i] = soa.vz[i] = 0;
        soa.mass[i] = 1;
        soa.id[i] = i;
    }
    printf("sizeof(struct particle) = %zu bytes\n", sizeof(struct particle));

    /* Only one field is needed: the average x. */
    double t0 = now();
    double sum = 0;
    for (int i = 0; i < N; i++) sum += aos[i].x;
    double t1 = now();
    printf("array of structs:  mean x %.2f in %5.1f ms\n", sum / N, (t1 - t0) * 1000);

    t0 = now();
    sum = 0;
    for (int i = 0; i < N; i++) sum += soa.x[i];
    t1 = now();
    printf("struct of arrays:  mean x %.2f in %5.1f ms\n", sum / N, (t1 - t0) * 1000);

    free(aos);
    free(soa.x); free(soa.y); free(soa.z); free(soa.vx); free(soa.vy); free(soa.vz); free(soa.mass); free(soa.id);
    return 0;
}
