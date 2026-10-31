#define _POSIX_C_SOURCE 200809L /* for nanosleep */
#include <pthread.h>
#include <stdio.h>
#include <time.h>

int items = 0; /* how many items are waiting */
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t ready = PTHREAD_COND_INITIALIZER;
int took = 0;

static void *consumer(void *arg) {
    (void) arg;
    pthread_mutex_lock(&lock);
    while (items == 0) { /* check again after every wake-up */
        pthread_cond_wait(&ready, &lock);
    }
    items--;
    took++;
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

    nanosleep(&(struct timespec){0, 100000000}, NULL);
    pthread_mutex_lock(&lock);
    printf("after one item: %d taken, the other consumer is still waiting\n", took);
    items = 1;                        /* a second item, for the waiting consumer */
    pthread_cond_signal(&ready);
    pthread_mutex_unlock(&lock);

    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("after two items: %d taken\n", took);
    return 0;
}
