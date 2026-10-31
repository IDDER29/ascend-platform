#include <stdio.h>

#define CAP 16

static int heap[CAP];
static int size = 0;

static void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

static void push(int value) {
    int i = size++;
    heap[i] = value;
    while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
        swap(&heap[(i - 1) / 2], &heap[i]);
        i = (i - 1) / 2;
    }
}

static int pop(void) {
    int top = heap[0];
    heap[0] = heap[--size];
    int i = 0;
    for (;;) {
        int left = 2 * i + 1;
        if (left < size && heap[left] < heap[i]) {
            swap(&heap[i], &heap[left]);
            i = left;
        } else {
            break;
        }
    }
    return top;
}

int main(void) {
    int values[] = {42, 17, 8, 25, 3, 31, 12};
    for (int k = 0; k < 7; k++) {
        push(values[k]);
    }
    while (size > 0) printf(" %d", pop());
    printf("\n");
    return 0;
}
