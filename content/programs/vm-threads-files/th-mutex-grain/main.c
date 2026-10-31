#define _POSIX_C_SOURCE 200809L /* for clock_gettime */
#include <pthread.h>
#include <stdio.h>
#include <time.h>

#define THREADS 4
#define ROUNDS 1000000

long total = 0;
pthread_mutex_t total_lock = PTHREAD_MUTEX_INITIALIZER;

/* Fine-grained: lock for every single addition. */
static void *each_time(void *arg) {
    (void) arg;
    for (int i = 0; i < ROUNDS; i++) {
        pthread_mutex_lock(&total_lock);
        total++;
        pthread_mutex_unlock(&total_lock);
    }
    return NULL;
}

/* Coarse: add up privately, then lock once to publish the result. */
static void *once(void *arg) {
    (void) arg;
    long mine = 0;
    for (int i = 0; i < ROUNDS; i++) {
        mine++;
    }
    pthread_mutex_lock(&total_lock);
    total += mine;
    pthread_mutex_unlock(&total_lock);
    return NULL;
}

static double run(void *(*fn)(void *)) {
    struct timespec a, b;
    pthread_t t[THREADS];
    total = 0;
    clock_gettime(CLOCK_MONOTONIC, &a);
    for (int i = 0; i < THREADS; i++) {
        pthread_create(&t[i], NULL, fn, NULL);
    }
    for (int i = 0; i < THREADS; i++) {
        pthread_join(t[i], NULL);
    }
    clock_gettime(CLOCK_MONOTONIC, &b);
    return (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6;
}

int main(void) {
    double fine = run(each_time);
    printf("lock every time: total %ld in %.1f ms\n", total, fine);
    double coarse = run(once);
    printf("lock once each:  total %ld in %.1f ms\n", total, coarse);
    return 0;
}
