/* Two threads, each adding 1 to its own atomic counter 20 million times. The counters never share a
   value, but in the first run they share a 64-byte cache line; in the second each has a line of its own. */
#define _POSIX_C_SOURCE 200809L
#include <pthread.h>
#include <stdalign.h>
#include <stdatomic.h>
#include <stdio.h>
#include <time.h>

#define N 20000000L

struct adjacent {
    _Atomic long a;
    _Atomic long b; /* 8 bytes later: the same cache line as a */
};

struct padded {
    alignas(64) _Atomic long a;
    alignas(64) _Atomic long b; /* 64 bytes later: a cache line of its own */
};

static struct adjacent near;
static struct padded far;

static void count(_Atomic long *c) {
    for (long i = 0; i < N; i++) {
        atomic_fetch_add_explicit(c, 1, memory_order_relaxed); /* one locked add on x86 */
    }
}
static void *near_a(void *arg) { (void) arg; count(&near.a); return NULL; }
static void *near_b(void *arg) { (void) arg; count(&near.b); return NULL; }
static void *far_a(void *arg) { (void) arg; count(&far.a); return NULL; }
static void *far_b(void *arg) { (void) arg; count(&far.b); return NULL; }

static double run(void *(*f1)(void *), void *(*f2)(void *)) {
    struct timespec t0, t1;
    pthread_t x, y;
    clock_gettime(CLOCK_MONOTONIC, &t0);
    pthread_create(&x, NULL, f1, NULL);
    pthread_create(&y, NULL, f2, NULL);
    pthread_join(x, NULL);
    pthread_join(y, NULL);
    clock_gettime(CLOCK_MONOTONIC, &t1);
    return (double) (t1.tv_sec - t0.tv_sec) * 1e3 + (double) (t1.tv_nsec - t0.tv_nsec) / 1e6;
}

int main(void) {
    printf("distance between the counters: %zu bytes, then %zu bytes\n",
           (size_t) ((char *) &near.b - (char *) &near.a), (size_t) ((char *) &far.b - (char *) &far.a));
    double same = run(near_a, near_b);
    double apart = run(far_a, far_b);
    printf("same cache line:      %7.1f ms (a = %ld, b = %ld)\n", same, (long) near.a, (long) near.b);
    printf("separate cache lines: %7.1f ms (a = %ld, b = %ld)\n", apart, (long) far.a, (long) far.b);
    printf("the shared line was %.1f times slower\n", same / apart);
    return 0;
}
