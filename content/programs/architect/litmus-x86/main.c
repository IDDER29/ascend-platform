/* Three litmus tests run on this x86 machine, 100000 trials each. Relaxed atomics, with
   atomic_signal_fence as a compiler-only barrier, so what we see is the hardware's ordering. */
#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>

#define TRIALS 100000
#define KEEP_ORDER() atomic_signal_fence(memory_order_seq_cst) /* stops gcc reordering; emits nothing */

atomic_int x, y;
int r1, r2;
atomic_int go = 0, finished = 0;

static void jitter(unsigned *state) {
    *state = *state * 1103515245u + 12345u;
    for (volatile unsigned i = 0; i < (*state >> 16) % 8; i++) {
    }
}

/* Each test is two threads: FIRST runs in thread 1, SECOND in thread 2. */
#define TEST(name, FIRST, SECOND)                       \
    static void *name##_1(void *arg) {                  \
        (void) arg;                                     \
        unsigned state = 1;                             \
        for (int trial = 1; trial <= TRIALS; trial++) { \
            while (atomic_load(&go) != trial) {         \
            }                                           \
            jitter(&state);                             \
            FIRST;                                      \
            atomic_fetch_add(&finished, 1);             \
        }                                               \
        return NULL;                                    \
    }                                                   \
    static void *name##_2(void *arg) {                  \
        (void) arg;                                     \
        unsigned state = 2;                             \
        for (int trial = 1; trial <= TRIALS; trial++) { \
            while (atomic_load(&go) != trial) {         \
            }                                           \
            jitter(&state);                             \
            SECOND;                                     \
            atomic_fetch_add(&finished, 1);             \
        }                                               \
        return NULL;                                    \
    }

#define ST(v, n) atomic_store_explicit(&v, n, memory_order_relaxed)
#define LD(v) atomic_load_explicit(&v, memory_order_relaxed)

/* Store buffering: write mine, read yours. */
TEST(sb, (ST(x, 1), KEEP_ORDER(), r1 = LD(y)), (ST(y, 1), KEEP_ORDER(), r2 = LD(x)))
/* The same, with a full fence between the store and the load (gcc emits a locked instruction). */
TEST(sb_fence, (ST(x, 1), atomic_thread_fence(memory_order_seq_cst), r1 = LD(y)),
     (ST(y, 1), atomic_thread_fence(memory_order_seq_cst), r2 = LD(x)))
/* Message passing: write the data, then the flag; the reader reads the flag, then the data. */
TEST(mp, (ST(x, 1), KEEP_ORDER(), ST(y, 1)), (r1 = LD(y), KEEP_ORDER(), r2 = LD(x)))

static int count(void *(*first)(void *), void *(*second)(void *), int want1, int want2) {
    atomic_store(&go, 0);
    pthread_t a, b;
    pthread_create(&a, NULL, first, NULL);
    pthread_create(&b, NULL, second, NULL);
    int seen = 0;
    for (int trial = 1; trial <= TRIALS; trial++) {
        atomic_store(&x, 0);
        atomic_store(&y, 0);
        r1 = r2 = -1;
        atomic_store(&finished, 0);
        atomic_store(&go, trial);
        while (atomic_load(&finished) != 2) {
        }
        if (r1 == want1 && r2 == want2) {
            seen++;
        }
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    return seen;
}

int main(void) {
    printf("store buffering, no fence:  r1 = 0 and r2 = 0 in %6d of %d trials\n", count(sb_1, sb_2, 0, 0), TRIALS);
    printf("store buffering, fence:     r1 = 0 and r2 = 0 in %6d of %d trials\n", count(sb_fence_1, sb_fence_2, 0, 0), TRIALS);
    printf("message passing:            flag 1, data 0  in %6d of %d trials\n", count(mp_1, mp_2, 1, 0), TRIALS);
    return 0;
}
