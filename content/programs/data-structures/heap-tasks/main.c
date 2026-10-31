#include <stdio.h>

#define CAP 16

/* A priority queue of tasks: the lowest number is the most urgent. */
struct task {
    int priority;
    const char *name;
};

static struct task heap[CAP];
static int size = 0;

static void swap(struct task *a, struct task *b) {
    struct task t = *a;
    *a = *b;
    *b = t;
}

static void push(int priority, const char *name) {
    int i = size++;
    heap[i] = (struct task){priority, name};
    while (i > 0 && heap[(i - 1) / 2].priority > heap[i].priority) {
        swap(&heap[(i - 1) / 2], &heap[i]);
        i = (i - 1) / 2;
    }
}

static struct task pop(void) {
    struct task top = heap[0];
    heap[0] = heap[--size];
    int i = 0;
    for (;;) {
        int left = 2 * i + 1, right = 2 * i + 2, best = i;
        if (left < size && heap[left].priority < heap[best].priority) best = left;
        if (right < size && heap[right].priority < heap[best].priority) best = right;
        if (best == i) break;
        swap(&heap[i], &heap[best]);
        i = best;
    }
    return top;
}

int main(void) {
    push(3, "reply to email");
    push(1, "fix the outage");
    push(4, "tidy the desk");
    push(2, "review a patch");
    struct task t = pop();
    printf("next: %s\n", t.name);
    push(0, "fire alarm");
    while (size > 0) {
        t = pop();
        printf("next: %s\n", t.name);
    }
    return 0;
}
