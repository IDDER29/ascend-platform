#define _POSIX_C_SOURCE 200809L /* for nanosleep */
#include <pthread.h>
#include <stdio.h>
#include <time.h>

int balance = 100;
int refused = 0;
pthread_mutex_t account = PTHREAD_MUTEX_INITIALIZER;

/* Take 80 out, but only if there's enough. Check and act under one lock. */
static void *withdraw(void *arg) {
    (void) arg;
    pthread_mutex_lock(&account);
    if (balance >= 80) {
        nanosleep(&(struct timespec){0, 1000000}, NULL); /* the same 1 ms pause as before */
        balance -= 80;
    } else {
        refused++;
    }
    pthread_mutex_unlock(&account);
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&a, NULL, withdraw, NULL);
    pthread_create(&b, NULL, withdraw, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("balance: %d, withdrawals refused: %d\n", balance, refused);
    return 0;
}
