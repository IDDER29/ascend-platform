#define _POSIX_C_SOURCE 200809L /* for nanosleep */
#include <pthread.h>
#include <stdio.h>
#include <time.h>

int items = 0; /* how many items are waiting */
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t ready = PTHREAD_COND_INITIALIZER;
int took = 0, found_empty = 0;

static void *consumer(void *arg) {
    (void) arg;
    pthread_mutex_lock(&lock);
    if (items == 0) { /* BUG: should be while */
        pthread_cond_wait(&ready, &lock);
    }
    if (items > 0) {
        items--;
        took++;
    } else {
        found_empty++; /* woke up, but there was nothing to take */
    }
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&a, NULL, consumer, NULL);
    pthread_create(&b, NULL, consumer, NULL);
    nanosleep(&(struct timespec){0, 100000000}, NULL); /* let both consumers start waiting */

    pthread_mutex_lock(&lock);
    items = 1;                        /* one item... */
    pthread_cond_broadcast(&ready);   /* ...but wake everyone */
    pthread_mutex_unlock(&lock);

    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("took an item: %d, woke to an empty queue: %d\n", took, found_empty);
    return 0;
}
