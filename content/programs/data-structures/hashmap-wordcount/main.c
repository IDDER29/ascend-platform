#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "hashmap.h"

typedef struct {
    const char *word;
    int count;
} pair;

typedef struct {
    pair *items;
    size_t n;
} collector;

/* Called by hm_each for every word: keep the ones seen at least twice. */
static void collect(const char *key, int value, void *ctx) {
    collector *c = ctx;
    if (value >= 2) {
        c->items[c->n++] = (pair){key, value};
    }
}

/* Most frequent first; ties in alphabetical order, so the output never depends on the buckets. */
static int by_count(const void *a, const void *b) {
    const pair *x = a;
    const pair *y = b;
    if (x->count != y->count) {
        return y->count - x->count;
    }
    return strcmp(x->word, y->word);
}

int main(void) {
    hashmap *m = hm_new();
    if (m == NULL) {
        return 1;
    }
    char word[64];
    size_t len = 0;
    int ch;
    while ((ch = getchar()) != EOF) {
        if (isalpha(ch) && len < sizeof word - 1) {
            word[len++] = (char) tolower(ch);
        } else if (!isalpha(ch) && len > 0) {
            word[len] = '\0';
            int n = 0;
            hm_get(m, word, &n);
            if (!hm_put(m, word, n + 1)) {
                hm_free(m);
                return 1;
            }
            len = 0;
        }
    }

    collector c = {malloc(hm_count(m) * sizeof(pair)), 0};
    if (c.items == NULL) {
        hm_free(m);
        return 1;
    }
    hm_each(m, collect, &c);
    qsort(c.items, c.n, sizeof(pair), by_count);
    printf("%zu different words\n", hm_count(m));
    for (size_t i = 0; i < c.n; i++) {
        printf("%3d  %s\n", c.items[i].count, c.items[i].word);
    }
    free(c.items);
    hm_free(m);
    return 0;
}
