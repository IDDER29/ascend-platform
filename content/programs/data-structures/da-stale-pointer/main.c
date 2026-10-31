#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    size_t len, cap;
} Vec;

static int vec_push(Vec *v, int x) {
    if (v->len == v->cap) {
        size_t new_cap = v->cap ? v->cap * 2 : 4;
        int *bigger = realloc(v->data, new_cap * sizeof *bigger);
        if (bigger == NULL) {
            return -1;
        }
        v->data = bigger;
        v->cap = new_cap;
    }
    v->data[v->len++] = x;
    return 0;
}

int main(void) {
    Vec v = {0};
    for (int i = 1; i <= 4; i++) {
        vec_push(&v, i * 10);
    }
    int *first = &v.data[0]; /* a pointer into the array */
    printf("first = %d\n", *first);
    fflush(stdout);

    vec_push(&v, 50); /* the fifth push grows the array */
    printf("first = %d\n", *first);

    free(v.data);
    return 0;
}
