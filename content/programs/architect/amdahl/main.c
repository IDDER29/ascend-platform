#define _POSIX_C_SOURCE 200809L
#include <pthread.h>
#include <stdint.h>
#include <stdio.h>
#include <time.h>

#define SERIAL_WORK 40000000ULL     /* done by one thread, whatever happens */
#define PARALLEL_WORK 160000000ULL  /* split evenly between the threads */

static double now(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &t);
    return (double) t.tv_sec + (double) t.tv_nsec / 1e9;
}

/* Pure computation: a chain of multiplies, no memory traffic. */
static uint64_t spin(uint64_t n, uint64_t seed) {
    uint64_t x = seed;
    for (uint64_t i = 0; i < n; i++) {
        x = x * 6364136223846793005ULL + 1442695040888963407ULL;
    }
    return x;
}

typedef struct {
    uint64_t n;
    uint64_t result;
} job;

static void *worker(void *arg) {
    job *j = arg;
    j->result = spin(j->n, (uint64_t) (uintptr_t) arg);
    return NULL;
}

/* Run the serial part, then the parallel part on t threads; return seconds and the serial share. */
static double run(int t, double *serial_secs) {
    double start = now();
    volatile uint64_t sink = spin(SERIAL_WORK, 1);
    double mid = now();
    pthread_t threads[8];
    job jobs[8];
    for (int i = 0; i < t; i++) {
        jobs[i].n = PARALLEL_WORK / (uint64_t) t;
        pthread_create(&threads[i], NULL, worker, &jobs[i]);
    }
    for (int i = 0; i < t; i++) {
        pthread_join(threads[i], NULL);
        sink = sink + jobs[i].result;
    }
    double end = now();
    (void) sink;
    *serial_secs = mid - start;
    return end - start;
}

int main(void) {
    double serial;
    run(1, &serial); /* a warm-up run, not measured: it lets the CPU's clock speed up first */
    double t1 = run(1, &serial);
    double p = (t1 - serial) / t1; /* the parallelisable share, measured on one thread */
    printf("1 thread: %.3f s, of which serial %.3f s, so p = %.2f\n", t1, serial, p);
    printf("threads  predicted  measured\n");
    int counts[] = {2, 4, 8};
    for (int k = 0; k < 3; k++) {
        int t = counts[k];
        double ignored;
        double tt = run(t, &ignored);
        double predicted = 1.0 / ((1.0 - p) + p / t);
        printf("%7d  %8.2fx  %7.2fx\n", t, predicted, t1 / tt);
    }
    printf("limit with infinite threads: %.2fx\n", 1.0 / (1.0 - p));
    return 0;
}
