#define _POSIX_C_SOURCE 200809L /* for nanosleep and clock_gettime */
#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>
#include <time.h>

atomic_int done_busy = 0;
int done = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t changed = PTHREAD_COND_INITIALIZER;

static double cpu_ms(void) { /* CPU time this thread has used */
    struct timespec t;
    clock_gettime(CLOCK_THREAD_CPUTIME_ID, &t);
    return t.tv_sec * 1e3 + t.tv_nsec / 1e6;
}

static void *busy_waiter(void *arg) {
    double *used = arg;
    while (!atomic_load(&done_busy)) {
        /* spin: check again and again */
    }
    *used = cpu_ms();
    return NULL;
}

static void *sleeping_waiter(void *arg) {
    double *used = arg;
    pthread_mutex_lock(&lock);
    while (!done) {
        pthread_cond_wait(&changed, &lock); /* sleep until signalled */
    }
    pthread_mutex_unlock(&lock);
    *used = cpu_ms();
    return NULL;
}

int main(void) {
    double busy = 0, sleeping = 0;
    pthread_t a, b;
    pthread_create(&a, NULL, busy_waiter, &busy);
    pthread_create(&b, NULL, sleeping_waiter, &sleeping);

    nanosleep(&(struct timespec){0, 500000000}, NULL); /* both wait half a second */
    atomic_store(&done_busy, 1);
    pthread_mutex_lock(&lock);
    done = 1;
    pthread_cond_signal(&changed);
    pthread_mutex_unlock(&lock);

    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("busy waiting used     %6.1f ms of CPU\n", busy);
    printf("condition wait used   %6.1f ms of CPU\n", sleeping);
    return 0;
}
