#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *items;
    int len;
} Stack;

static int pop(Stack *s) {
    return s->items[--s->len];
}

int main(void) {
    Stack s = {malloc(4 * sizeof(int)), 0};
    if (s.items == NULL) {
        return 1;
    }
    s.items[s.len++] = 7;
    printf("pop: %d\n", pop(&s));
    fflush(stdout);
    printf("pop: %d\n", pop(&s));
    free(s.items);
    return 0;
}
