#include <assert.h>
#include <stdio.h>
#include "threadpool.h"

#define TASKS 1000

typedef struct {
    int n;
    long result;
} job;

/* Each task writes only its own job, so the tasks never share data. */
static void square(void *arg) {
    job *j = arg;
    j->result = (long) j->n * j->n;
}

int main(void) {
    static job jobs[TASKS];
    threadpool *p = tp_new(4);
    assert(p != NULL);
    for (int i = 0; i < TASKS; i++) {
        jobs[i].n = i + 1;
        assert(tp_submit(p, square, &jobs[i]) == 0);
    }
    tp_wait(p);

    long sum = 0;
    for (int i = 0; i < TASKS; i++) {
        sum += jobs[i].result;
    }
    long expected = (long) TASKS * (TASKS + 1) * (2 * TASKS + 1) / 6;
    printf("%d tasks on 4 workers: sum of squares %ld (expected %ld)\n", TASKS, sum, expected);
    assert(sum == expected);

    /* The pool can be used again after tp_wait. */
    for (int i = 0; i < TASKS; i++) {
        jobs[i].n = 2;
        assert(tp_submit(p, square, &jobs[i]) == 0);
    }
    tp_free(p);
    sum = 0;
    for (int i = 0; i < TASKS; i++) {
        sum += jobs[i].result;
    }
    printf("second batch after tp_free: %ld (expected %d)\n", sum, 4 * TASKS);
    assert(sum == 4 * TASKS);
    printf("all tests passed\n");
    return 0;
}
