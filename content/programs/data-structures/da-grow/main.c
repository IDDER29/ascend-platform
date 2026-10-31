#include <stdio.h>
#include <stdlib.h>

/* A dynamic array of ints: the vector owns `data` and frees it in vec_free. */
typedef struct {
    int *data;
    size_t len;      /* how many items are in use */
    size_t cap;      /* how many fit before we must grow */
    size_t copied;   /* items copied by growing, so we can count the cost */
} Vec;

/* Grow to at least new_cap. Returns 0 on success, -1 if memory ran out (v is unchanged). */
static int vec_reserve(Vec *v, size_t new_cap) {
    int *bigger = realloc(v->data, new_cap * sizeof *bigger);
    if (bigger == NULL) {
        return -1;
    }
    v->copied += v->len; /* realloc may have to copy every item to a new block */
    v->data = bigger;
    v->cap = new_cap;
    return 0;
}

static int vec_push(Vec *v, int x, int doubling) {
    if (v->len == v->cap) {
        size_t new_cap = doubling ? (v->cap ? v->cap * 2 : 1) : v->cap + 1;
        if (vec_reserve(v, new_cap) != 0) {
            return -1;
        }
    }
    v->data[v->len++] = x;
    return 0;
}

static void vec_free(Vec *v) {
    free(v->data);
    v->data = NULL;
    v->len = v->cap = 0;
}

int main(void) {
    Vec d = {0};
    printf("doubling, capacity after each grow:");
    for (int i = 0; i < 20; i++) {
        size_t before = d.cap;
        if (vec_push(&d, i, 1) != 0) {
            return 1;
        }
        if (d.cap != before) {
            printf(" %zu", d.cap);
        }
    }
    printf("\n");
    vec_free(&d);

    for (int doubling = 1; doubling >= 0; doubling--) {
        Vec v = {0};
        for (int i = 0; i < 10000; i++) {
            if (vec_push(&v, i, doubling) != 0) {
                return 1;
            }
        }
        printf("%-8s 10000 pushes: %zu items copied, %.1f per push\n", doubling ? "doubling" : "+1", v.copied,
               (double) v.copied / 10000);
        vec_free(&v);
    }
    return 0;
}
