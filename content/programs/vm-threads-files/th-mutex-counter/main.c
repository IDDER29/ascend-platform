#include <pthread.h>
#include <stdio.h>

#define ROUNDS 1000000

long count = 0;
pthread_mutex_t count_lock = PTHREAD_MUTEX_INITIALIZER;

static void *work(void *arg) {
    (void) arg;
    for (int i = 0; i < ROUNDS; i++) {
        pthread_mutex_lock(&count_lock);
        count++; /* the critical section: one thread at a time */
        pthread_mutex_unlock(&count_lock);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&a, NULL, work, NULL);
    pthread_create(&b, NULL, work, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected %d, got %ld\n", 2 * ROUNDS, count);
    return 0;
}
