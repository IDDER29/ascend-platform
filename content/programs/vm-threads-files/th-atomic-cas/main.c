#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>

#define THREADS 4

atomic_int best = 0; /* the largest value any thread has seen */

/* Raise best to value, if value is larger, without a lock. */
static void update_max(int value) {
    int seen = atomic_load(&best);
    while (value > seen) {
        /* If best still holds seen, swap in value; if not, seen gets best's new value and we retry. */
        if (atomic_compare_exchange_weak(&best, &seen, value)) {
            return;
        }
    }
}

static void *work(void *arg) {
    int id = *(int *) arg;
    for (int i = 0; i < 100000; i++) {
        update_max((i * 7919 + id * 104729) % 1000003); /* a stream of different numbers */
    }
    return NULL;
}

int main(void) {
    pthread_t t[THREADS];
    int ids[THREADS];
    for (int i = 0; i < THREADS; i++) {
        ids[i] = i;
        pthread_create(&t[i], NULL, work, &ids[i]);
    }
    for (int i = 0; i < THREADS; i++) {
        pthread_join(t[i], NULL);
    }

    int check = 0; /* the same maximum, worked out by one thread */
    for (int id = 0; id < THREADS; id++) {
        for (int i = 0; i < 100000; i++) {
            int v = (i * 7919 + id * 104729) % 1000003;
            if (v > check) {
                check = v;
            }
        }
    }
    printf("lock-free max: %d, checked: %d\n", atomic_load(&best), check);
    return 0;
}
