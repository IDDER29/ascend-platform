#define _POSIX_C_SOURCE 200809L /* for nanosleep */
#include <pthread.h>
#include <stdio.h>
#include <time.h>

int balance = 100;

/* Take 80 out, but only if there's enough. */
static void *withdraw(void *arg) {
    const char *who = arg;
    if (balance >= 80) {    /* check */
        nanosleep(&(struct timespec){0, 1000000}, NULL); /* 1 ms: a switch could come here at any time; this makes it likely */
        balance -= 80;      /* act */
        printf("%s took 80\n", who);
    } else {
        printf("%s was refused\n", who);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&a, NULL, withdraw, "Ana");
    pthread_create(&b, NULL, withdraw, "Ben");
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("balance: %d\n", balance);
    return 0;
}
