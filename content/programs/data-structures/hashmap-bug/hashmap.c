#include "hashmap.h"

#include <stdint.h>
#include <stdlib.h>
#include <string.h>

typedef struct entry {
    char *key;
    int value;
    struct entry *next; /* the next entry in the same bucket */
} entry;

struct hashmap {
    entry **buckets;
    size_t capacity; /* number of buckets, always a power of two */
    size_t count;
};

/* FNV-1a: a simple, well-spread hash for strings. */
static uint64_t hash(const char *key) {
    uint64_t h = 14695981039346656037u;
    for (const unsigned char *p = (const unsigned char *) key; *p != '\0'; p++) {
        h ^= *p;
        h *= 1099511628211u;
    }
    return h;
}

static size_t slot(const hashmap *m, const char *key) {
    return (size_t) (hash(key) & (m->capacity - 1));
}

hashmap *hm_new(void) {
    hashmap *m = malloc(sizeof *m);
    if (m == NULL) {
        return NULL;
    }
    m->capacity = 8;
    m->count = 0;
    m->buckets = calloc(m->capacity, sizeof *m->buckets);
    if (m->buckets == NULL) {
        free(m);
        return NULL;
    }
    return m;
}

void hm_free(hashmap *m) {
    if (m == NULL) {
        return;
    }
    for (size_t i = 0; i < m->capacity; i++) {
        entry *e = m->buckets[i];
        while (e != NULL) {
            entry *next = e->next;
            free(e);
            e = next;
        }
    }
    free(m->buckets);
    free(m);
}

/* Double the buckets and move every entry to its new bucket. The entries
   themselves are reused, so nothing is copied or freed. */
static bool grow(hashmap *m) {
    size_t new_capacity = m->capacity * 2;
    entry **fresh = calloc(new_capacity, sizeof *fresh);
    if (fresh == NULL) {
        return false;
    }
    for (size_t i = 0; i < m->capacity; i++) {
        entry *e = m->buckets[i];
        while (e != NULL) {
            entry *next = e->next;
            size_t j = (size_t) (hash(e->key) & (new_capacity - 1));
            e->next = fresh[j];
            fresh[j] = e;
            e = next;
        }
    }
    free(m->buckets);
    m->buckets = fresh;
    m->capacity = new_capacity;
    return true;
}

bool hm_put(hashmap *m, const char *key, int value) {
    for (entry *e = m->buckets[slot(m, key)]; e != NULL; e = e->next) {
        if (strcmp(e->key, key) == 0) {
            e->value = value; /* already there: just update it */
            return true;
        }
    }
    /* Keep the load (entries per bucket) at most 3/4, so chains stay short. */
    if ((m->count + 1) * 4 > m->capacity * 3 && !grow(m)) {
        return false;
    }
    entry *e = malloc(sizeof *e);
    if (e == NULL) {
        return false;
    }
    e->key = (char *) key; /* keep the caller's string instead of a copy */
    e->value = value;
    size_t i = slot(m, key);
    e->next = m->buckets[i];
    m->buckets[i] = e;
    m->count++;
    return true;
}

bool hm_get(const hashmap *m, const char *key, int *value) {
    for (const entry *e = m->buckets[slot(m, key)]; e != NULL; e = e->next) {
        if (strcmp(e->key, key) == 0) {
            *value = e->value;
            return true;
        }
    }
    return false;
}

bool hm_remove(hashmap *m, const char *key) {
    entry **link = &m->buckets[slot(m, key)];
    while (*link != NULL) {
        entry *e = *link;
        if (strcmp(e->key, key) == 0) {
            *link = e->next; /* unlink it, then free it */
            free(e);
            m->count--;
            return true;
        }
        link = &e->next;
    }
    return false;
}

size_t hm_count(const hashmap *m) {
    return m->count;
}

size_t hm_capacity(const hashmap *m) {
    return m->capacity;
}

void hm_each(const hashmap *m, void (*fn)(const char *key, int value, void *ctx), void *ctx) {
    for (size_t i = 0; i < m->capacity; i++) {
        for (const entry *e = m->buckets[i]; e != NULL; e = e->next) {
            fn(e->key, e->value, ctx);
        }
    }
}
