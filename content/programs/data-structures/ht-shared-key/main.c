#include <stdio.h>
#include <string.h>

#define BUCKETS 8

typedef struct {
    const char *key;
    int count;
} Slot;

static unsigned hash(const char *s) {
    unsigned h = 2166136261u;
    for (; *s != '\0'; s++) {
        h = (h ^ (unsigned char) *s) * 16777619u;
    }
    return h;
}

/* Open addressing: on a collision, try the next slot. */
static void add_word(Slot *t, const char *key) {
    unsigned i = hash(key) % BUCKETS;
    while (t[i].key != NULL && strcmp(t[i].key, key) != 0) {
        i = (i + 1) % BUCKETS;
    }
    if (t[i].key == NULL) {
        t[i].key = key;
    }
    t[i].count++;
}

int main(void) {
    Slot table[BUCKETS] = {0};
    char word[32];
    while (scanf("%31s", word) == 1) {
        add_word(table, word);
    }
    for (int i = 0; i < BUCKETS; i++) {
        if (table[i].key != NULL) {
            printf("slot %d: %s x%d\n", i, table[i].key, table[i].count);
        }
    }
    return 0;
}
