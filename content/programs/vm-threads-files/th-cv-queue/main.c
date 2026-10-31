#include <pthread.h>
#include <stdio.h>

#define CAPACITY 4
#define ITEMS 20

/* A bounded queue: a ring buffer of CAPACITY ints, guarded by one mutex. */
int buffer[CAPACITY];
int head = 0, tail = 0, count = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t not_full = PTHREAD_COND_INITIALIZER;
pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;

static void put(int value) {
    pthread_mutex_lock(&lock);
    while (count == CAPACITY) { /* full: sleep until a consumer makes room */
        pthread_cond_wait(&not_full, &lock);
    }
    buffer[tail] = value;
    tail = (tail + 1) % CAPACITY;
    count++;
    pthread_cond_signal(&not_empty);
    pthread_mutex_unlock(&lock);
}

static int take(void) {
    pthread_mutex_lock(&lock);
    while (count == 0) { /* empty: sleep until a producer adds something */
        pthread_cond_wait(&not_empty, &lock);
    }
    int value = buffer[head];
    head = (head + 1) % CAPACITY;
    count--;
    pthread_cond_signal(&not_full);
    pthread_mutex_unlock(&lock);
    return value;
}

static void *producer(void *arg) {
    (void) arg;
    for (int i = 1; i <= ITEMS; i++) {
        put(i);
    }
    return NULL;
}

static void *consumer(void *arg) {
    long *sum = arg;
    for (int i = 0; i < ITEMS; i++) {
        *sum += take();
    }
    return NULL;
}

int main(void) {
    long sum = 0;
    pthread_t p, c;
    pthread_create(&p, NULL, producer, NULL);
    pthread_create(&c, NULL, consumer, &sum);
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    printf("consumed %d items, sum %ld (expected 210)\n", ITEMS, sum);
    printf("queue left with %d items\n", count);
    return 0;
}
