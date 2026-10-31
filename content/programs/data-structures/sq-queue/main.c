#include <stdio.h>

/* A queue in a fixed ring of 4 slots: head is the next to leave, count how many are waiting. */
#define SLOTS 4

typedef struct {
    int items[SLOTS];
    int head;
    int count;
} Queue;

static int enqueue(Queue *q, int x) {
    if (q->count == SLOTS) {
        return -1; /* full */
    }
    int tail = (q->head + q->count) % SLOTS;
    q->items[tail] = x;
    q->count++;
    printf("enqueue %d into slot %d\n", x, tail);
    return 0;
}

static int dequeue(Queue *q, int *out) {
    if (q->count == 0) {
        return -1; /* empty */
    }
    *out = q->items[q->head];
    printf("dequeue %d from slot %d\n", *out, q->head);
    q->head = (q->head + 1) % SLOTS;
    q->count--;
    return 0;
}

int main(void) {
    Queue q = {0};
    int x;
    for (int i = 1; i <= 3; i++) {
        enqueue(&q, i * 100);
    }
    dequeue(&q, &x);
    dequeue(&q, &x);
    for (int i = 4; i <= 6; i++) {
        enqueue(&q, i * 100);
    }
    if (enqueue(&q, 700) != 0) {
        printf("enqueue 700: full\n");
    }
    while (dequeue(&q, &x) == 0) {
    }
    return 0;
}
