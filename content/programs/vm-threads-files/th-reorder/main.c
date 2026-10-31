#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>

#define TRIALS 200000

/* The store-buffering test: each thread writes its own flag, then reads the other's.
   If every access happened in program order, at least one thread would see a 1. */
atomic_int x, y;
int r1, r2;
atomic_int go = 0, finished = 0;

/* A tiny random pause, so the two threads' accesses line up in different ways. */
static void jitter(unsigned *state) {
    *state = *state * 1103515245u + 12345u;
    for (volatile unsigned i = 0; i < (*state >> 16) % 8; i++) {
    }
}

/* The memory order must be a constant, so each order gets its own pair of thread functions. */
#define THREADS(name, ORDER)                                     \
    static void *name##_1(void *arg) {                           \
        (void) arg;                                              \
        unsigned state = 1;                                      \
        for (int trial = 1; trial <= TRIALS; trial++) {          \
            while (atomic_load(&go) != trial) {                  \
            }                                                    \
            jitter(&state);                                      \
            atomic_store_explicit(&x, 1, ORDER);                 \
            r1 = atomic_load_explicit(&y, ORDER);                \
            atomic_fetch_add(&finished, 1);                      \
        }                                                        \
        return NULL;                                             \
    }                                                            \
    static void *name##_2(void *arg) {                           \
        (void) arg;                                              \
        unsigned state = 2;                                      \
        for (int trial = 1; trial <= TRIALS; trial++) {          \
            while (atomic_load(&go) != trial) {                  \
            }                                                    \
            jitter(&state);                                      \
            atomic_store_explicit(&y, 1, ORDER);                 \
            r2 = atomic_load_explicit(&x, ORDER);                \
            atomic_fetch_add(&finished, 1);                      \
        }                                                        \
        return NULL;                                             \
    }

THREADS(relaxed, memory_order_relaxed)
THREADS(seq_cst, memory_order_seq_cst)

static int both_zero(void *(*first)(void *), void *(*second)(void *)) {
    atomic_store(&go, 0);
    pthread_t a, b;
    pthread_create(&a, NULL, first, NULL);
    pthread_create(&b, NULL, second, NULL);
    int count = 0;
    for (int trial = 1; trial <= TRIALS; trial++) {
        atomic_store(&x, 0);
        atomic_store(&y, 0);
        atomic_store(&finished, 0);
        atomic_store(&go, trial); /* start both threads on this trial */
        while (atomic_load(&finished) != 2) {
        }
        if (r1 == 0 && r2 == 0) {
            count++;
        }
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    return count;
}

int main(void) {
    printf("relaxed: both read 0 in %d of %d trials\n", both_zero(relaxed_1, relaxed_2), TRIALS);
    printf("seq_cst: both read 0 in %d of %d trials\n", both_zero(seq_cst_1, seq_cst_2), TRIALS);
    return 0;
}
