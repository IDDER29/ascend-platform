#include <pthread.h>
#include <stdio.h>

int shared = 0; /* one copy, seen by every thread */

typedef struct {
    int id;
    int result;
} job;

static void *work(void *arg) {
    job *j = arg;
    int local = j->id * 100; /* on this thread's own stack */
    for (int i = 0; i < 3; i++) {
        local++;
    }
    j->result = local; /* hand the answer back through the argument */
    return NULL;
}

int main(void) {
    pthread_t threads[3];
    job jobs[3];
    for (int i = 0; i < 3; i++) {
        jobs[i].id = i + 1;
        pthread_create(&threads[i], NULL, work, &jobs[i]);
    }
    for (int i = 0; i < 3; i++) {
        pthread_join(threads[i], NULL);
        printf("thread %d: local ended at %d\n", jobs[i].id, jobs[i].result);
    }
    return 0;
}
