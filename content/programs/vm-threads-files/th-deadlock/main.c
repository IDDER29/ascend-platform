#define _POSIX_C_SOURCE 200809L /* for nanosleep */
#include <pthread.h>
#include <stdio.h>
#include <time.h>

typedef struct {
    int id; /* a fixed number per account, used to order the locks */
    int balance;
    pthread_mutex_t lock;
} account;

account savings = {1, 100, PTHREAD_MUTEX_INITIALIZER};
account checking = {2, 100, PTHREAD_MUTEX_INITIALIZER};

typedef struct {
    account *from, *to;
    int amount;
} transfer;

static void *move(void *arg) {
    transfer *t = arg;
    pthread_mutex_lock(&t->from->lock);
    nanosleep(&(struct timespec){0, 10000000}, NULL); /* 10 ms: makes the bad timing likely */
    pthread_mutex_lock(&t->to->lock);
    t->from->balance -= t->amount;
    t->to->balance += t->amount;
    pthread_mutex_unlock(&t->to->lock);
    pthread_mutex_unlock(&t->from->lock);
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0); /* print at once, in case the program never ends */
    transfer a = {&savings, &checking, 30};
    transfer b = {&checking, &savings, 50};
    pthread_t ta, tb;
    printf("starting two transfers\n");
    pthread_create(&ta, NULL, move, &a);
    pthread_create(&tb, NULL, move, &b);
    pthread_join(ta, NULL);
    pthread_join(tb, NULL);
    printf("savings %d, checking %d\n", savings.balance, checking.balance);
    return 0;
}
