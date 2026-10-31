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

static void add(list *l, const char *name, int qty) {
    if (l->count == l->capacity) {
        l->capacity = l->capacity ? l->capacity * 2 : 2;
        l->items = realloc(l->items, l->capacity);
    }
    l->items[l->count].name = strdup(name);
    l->items[l->count].qty = qty;
    l->count++;
}

int main(void) {
    list l = {NULL, 0, 0};
    char line[128];
    while (fgets(line, sizeof line, stdin) != NULL) {
        char *comma = strchr(line, ',');
        *comma = '\0';
        add(&l, line, atoi(comma + 1));
    }

    int total = 0;
    size_t best;
    for (size_t i = 0; i < l.count; i++) {
        total += l.items[i].qty;
        if (i == 0 || l.items[i].qty > l.items[best].qty) {
            best = i;
        }
    }
    printf("%zu items, %d in total\n", l.count, total);
    if (best < l.count) {
        printf("largest: %s (%d)\n", l.items[best].name, l.items[best].qty);
    }
    free(l.items);
    return 0;
}
