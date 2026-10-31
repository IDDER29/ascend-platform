#include <pthread.h>
#include <stdio.h>

#define ROUNDS 1000

long count = 0; /* shared by both threads, with no protection */

static void *work(void *arg) {
    (void) arg;
    for (int i = 0; i < ROUNDS; i++) {
        count++; /* read, add 1, write back */
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
