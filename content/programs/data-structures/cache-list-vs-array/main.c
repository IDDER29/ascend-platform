#define _POSIX_C_SOURCE 200809L /* for clock_gettime, which is POSIX, not standard C */
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define N 4000000

struct node {
    int value;
    struct node *next;
};

static double now(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &t);
    return (double) t.tv_sec + (double) t.tv_nsec / 1e9;
}

/* Link the nodes in the order given by order[], and return the first. */
static struct node *link_nodes(struct node *pool, const int *order) {
    for (int i = 0; i < N - 1; i++) pool[order[i]].next = &pool[order[i + 1]];
    pool[order[N - 1]].next = NULL;
    return &pool[order[0]];
}

static long walk(const struct node *p) {
    long sum = 0;
    for (; p != NULL; p = p->next) sum += p->value;
    return sum;
}

int main(void) {
    int *array = malloc(sizeof *array * N);
    struct node *pool = malloc(sizeof *pool * N);
    int *order = malloc(sizeof *order * N);
    if (!array || !pool || !order) return 1;
    for (int i = 0; i < N; i++) {
        array[i] = i & 7;
        pool[i].value = i & 7;
        order[i] = i;
    }

    double t0 = now();
    long sum = 0;
    for (int i = 0; i < N; i++) sum += array[i];
    double t1 = now();
    printf("array:                 sum %ld in %6.1f ms\n", sum, (t1 - t0) * 1000);

    struct node *head = link_nodes(pool, order); /* nodes in memory order */
    t0 = now();
    sum = walk(head);
    t1 = now();
    printf("list, nodes in order:  sum %ld in %6.1f ms\n", sum, (t1 - t0) * 1000);

    srand(1); /* shuffle the order, so each next pointer jumps somewhere else */
    for (int i = N - 1; i > 0; i--) {
        int j = (int) (((long) rand() * (i + 1)) / ((long) RAND_MAX + 1));
        int t = order[i];
        order[i] = order[j];
        order[j] = t;
    }
    head = link_nodes(pool, order);
    t0 = now();
    sum = walk(head);
    t1 = now();
    printf("list, nodes scattered: sum %ld in %6.1f ms\n", sum, (t1 - t0) * 1000);

    free(array);
    free(pool);
    free(order);
    return 0;
}
