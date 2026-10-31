#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define BUCKETS 8

/* The table owns each key: it stores its own copy, freed at the end. */
typedef struct {
    char *key;
    int count;
} Slot;

static unsigned hash(const char *s) {
    unsigned h = 2166136261u;
    for (; *s != '\0'; s++) {
        h = (h ^ (unsigned char) *s) * 16777619u;
    }
    return h;
}

/* Open addressing: on a collision, try the next slot. Returns 0, or -1 if memory ran out. */
static int add_word(Slot *t, const char *key) {
    unsigned i = hash(key) % BUCKETS;
    while (t[i].key != NULL && strcmp(t[i].key, key) != 0) {
        i = (i + 1) % BUCKETS;
    }
    if (t[i].key == NULL) {
        char *copy = malloc(strlen(key) + 1);
        if (copy == NULL) {
            return -1;
        }
        strcpy(copy, key);
        t[i].key = copy;
    }
    t[i].count++;
    return 0;
}

int main(void) {
    Slot table[BUCKETS] = {0};
    char word[32];
    while (scanf("%31s", word) == 1) {
        if (add_word(table, word) != 0) {
            return 1;
        }
    }
    for (int i = 0; i < BUCKETS; i++) {
        if (table[i].key != NULL) {
            printf("slot %d: %s x%d\n", i, table[i].key, table[i].count);
            free(table[i].key);
        }
    }
    return 0;
}
