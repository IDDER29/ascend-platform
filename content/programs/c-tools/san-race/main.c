#include <pthread.h>
#include <stdio.h>

static long hits = 0;

static void *count(void *arg) {
    (void) arg;
    for (int i = 0; i < 100000; i++) {
        hits++; /* both threads change hits without a lock */
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&a, NULL, count, NULL);
    pthread_create(&b, NULL, count, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("hits: %ld\n", hits);
    return 0;
}
