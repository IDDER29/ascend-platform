#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>

#define ROUNDS 1000000

atomic_long count = 0;
atomic_long relaxed_count = 0;

static void *work(void *arg) {
    (void) arg;
    for (int i = 0; i < ROUNDS; i++) {
        atomic_fetch_add(&count, 1); /* read, add and write as one indivisible step */
        atomic_fetch_add_explicit(&relaxed_count, 1, memory_order_relaxed);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&a, NULL, work, NULL);
    pthread_create(&b, NULL, work, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected %d\n", 2 * ROUNDS);
    printf("atomic (seq_cst): %ld\n", atomic_load(&count));
    printf("atomic (relaxed): %ld\n", atomic_load(&relaxed_count));
    return 0;
}
