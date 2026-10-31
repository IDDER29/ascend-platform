#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define BUCKETS 64

/* One entry in a bucket's chain. The table owns each entry and its copy of the key. */
typedef struct Entry {
    char *key;
    int count;
    struct Entry *next;
} Entry;

typedef struct {
    Entry *buckets[BUCKETS];
    unsigned (*hash)(const char *);
    long compares; /* key comparisons done by lookups, to measure the cost */
} Table;

/* FNV-1a: mixes every character into the hash. */
static unsigned hash_fnv(const char *s) {
    unsigned h = 2166136261u;
    for (; *s != '\0'; s++) {
        h = (h ^ (unsigned char) *s) * 16777619u;
    }
    return h;
}

/* A poor hash: only the first letter matters. */
static unsigned hash_first(const char *s) {
    return (unsigned char) s[0];
}

/* Add one to key's count, inserting it if new. Returns 0, or -1 if memory ran out. */
static int add_word(Table *t, const char *key) {
    unsigned b = t->hash(key) % BUCKETS;
    for (Entry *e = t->buckets[b]; e != NULL; e = e->next) {
        t->compares++;
        if (strcmp(e->key, key) == 0) {
            e->count++;
            return 0;
        }
    }
    Entry *e = malloc(sizeof *e);
    char *copy = malloc(strlen(key) + 1);
    if (e == NULL || copy == NULL) {
        free(e);
        free(copy);
        return -1;
    }
    strcpy(copy, key);
    e->key = copy;
    e->count = 1;
    e->next = t->buckets[b];
    t->buckets[b] = e;
    return 0;
}

static void table_free(Table *t) {
    for (int b = 0; b < BUCKETS; b++) {
        Entry *e = t->buckets[b];
        while (e != NULL) {
            Entry *next = e->next;
            free(e->key);
            free(e);
            e = next;
        }
        t->buckets[b] = NULL;
    }
}

static void stats(const char *name, Table *t) {
    int used = 0, longest = 0, words = 0;
    for (int b = 0; b < BUCKETS; b++) {
        int len = 0;
        for (Entry *e = t->buckets[b]; e != NULL; e = e->next) {
            len++;
        }
        used += len > 0;
        words += len;
        if (len > longest) {
            longest = len;
        }
    }
    printf("%-12s %d distinct words in %d of %d buckets, longest chain %d, %ld key comparisons\n", name, words,
           used, BUCKETS, longest, t->compares);
}

int main(void) {
    static char text[8192];
    size_t n = fread(text, 1, sizeof text - 1, stdin);
    text[n] = '\0';

    Table good = {.hash = hash_fnv}, bad = {.hash = hash_first};
    for (char *w = strtok(text, " \n.,;:!?\"()-"); w != NULL; w = strtok(NULL, " \n.,;:!?\"()-")) {
        for (char *c = w; *c != '\0'; c++) {
            if (*c >= 'A' && *c <= 'Z') {
                *c = (char) (*c - 'A' + 'a');
            }
        }
        if (add_word(&good, w) != 0 || add_word(&bad, w) != 0) {
            return 1;
        }
    }
    stats("FNV-1a", &good);
    stats("first letter", &bad);

    const char *probe[] = {"the", "memory", "pointer"};
    for (int i = 0; i < 3; i++) {
        unsigned b = hash_fnv(probe[i]) % BUCKETS;
        for (Entry *e = good.buckets[b]; e != NULL; e = e->next) {
            if (strcmp(e->key, probe[i]) == 0) {
                printf("\"%s\" is in bucket %u and appears %d times\n", probe[i], b, e->count);
            }
        }
    }
    table_free(&good);
    table_free(&bad);
    return 0;
}
