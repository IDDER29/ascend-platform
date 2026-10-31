#include <stdio.h>

#define CAP 16

/* A binary min-heap of ints, stored in an array.
   The children of index i are 2i+1 and 2i+2; its parent is (i-1)/2. */
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
    /* Sift up: swap with the parent while the parent is bigger. */
    while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
        swap(&heap[(i - 1) / 2], &heap[i]);
        i = (i - 1) / 2;
    }
}

static int pop(void) {
    int top = heap[0];
    heap[0] = heap[--size];
    /* Sift down: swap with the smaller child while a child is smaller. */
    int i = 0;
    for (;;) {
        int left = 2 * i + 1, right = 2 * i + 2, smallest = i;
        if (left < size && heap[left] < heap[smallest]) smallest = left;
        if (right < size && heap[right] < heap[smallest]) smallest = right;
        if (smallest == i) break;
        swap(&heap[i], &heap[smallest]);
        i = smallest;
    }
    return top;
}

static void show(const char *label) {
    printf("%-10s", label);
    for (int i = 0; i < size; i++) printf(" %d", heap[i]);
    printf("\n");
}

int main(void) {
    int values[] = {42, 17, 8, 25, 3, 31, 12};
    for (int k = 0; k < 7; k++) {
        push(values[k]);
    }
    show("array:");
    printf("pops:     ");
    while (size > 0) printf(" %d", pop());
    printf("\n");
    return 0;
}
