/* inventory: reads "name,quantity" lines and reports the total and the largest item. */
#define _POSIX_C_SOURCE 200809L /* for strdup */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char *name;
    int qty;
} item;

typedef struct {
    item *items;
    size_t count, capacity;
} list;

/* Returns 0 on success, -1 if memory ran out (the list is left as it was). */
static int add(list *l, const char *name, int qty) {
    if (l->count == l->capacity) {
        size_t capacity = l->capacity ? l->capacity * 2 : 2;
        item *grown = realloc(l->items, capacity * sizeof *grown); /* bytes, not items */
        if (grown == NULL) {
            return -1;
        }
        l->items = grown;
        l->capacity = capacity;
    }
    char *copy = strdup(name);
    if (copy == NULL) {
        return -1;
    }
    l->items[l->count].name = copy;
    l->items[l->count].qty = qty;
    l->count++;
    return 0;
}

static void free_list(list *l) {
    for (size_t i = 0; i < l->count; i++) {
        free(l->items[i].name);
    }
    free(l->items);
}

int main(void) {
    list l = {NULL, 0, 0};
    char line[128];
    int lineno = 0;
    while (fgets(line, sizeof line, stdin) != NULL) {
        lineno++;
        char *comma = strchr(line, ',');
        if (comma == NULL) {
            fprintf(stderr, "line %d: no comma, skipped\n", lineno);
            continue;
        }
        *comma = '\0';
        if (add(&l, line, atoi(comma + 1)) != 0) {
            fprintf(stderr, "out of memory\n");
            free_list(&l);
            return 1;
        }
    }

    int total = 0;
    size_t best = 0;
    for (size_t i = 0; i < l.count; i++) {
        total += l.items[i].qty;
        if (l.items[i].qty > l.items[best].qty) {
            best = i;
        }
    }
    printf("%zu items, %d in total\n", l.count, total);
    if (l.count > 0) {
        printf("largest: %s (%d)\n", l.items[best].name, l.items[best].qty);
    }
    free_list(&l);
    return 0;
}
