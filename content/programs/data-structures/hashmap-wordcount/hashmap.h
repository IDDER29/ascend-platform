#ifndef HASHMAP_H
#define HASHMAP_H

#include <stdbool.h>
#include <stddef.h>

/* A map from strings to ints. The map copies every key it stores and frees
   those copies itself; the caller keeps ownership of the keys it passes in. */
typedef struct hashmap hashmap;

hashmap *hm_new(void);                                 /* NULL if out of memory */
void hm_free(hashmap *m);                              /* frees the map and its key copies */
bool hm_put(hashmap *m, const char *key, int value);   /* false if out of memory */
bool hm_get(const hashmap *m, const char *key, int *value);
bool hm_remove(hashmap *m, const char *key);
size_t hm_count(const hashmap *m);
size_t hm_capacity(const hashmap *m);
/* Call fn once for every key and value, in no particular order. */
void hm_each(const hashmap *m, void (*fn)(const char *key, int value, void *ctx), void *ctx);

#endif
