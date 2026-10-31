#include <assert.h>
#include <stdio.h>
#include "hashmap.h"

static void test_put_and_get(void) {
    hashmap *m = hm_new();
    assert(m != NULL);
    assert(hm_put(m, "apple", 3));
    assert(hm_put(m, "pear", 5));
    int v = 0;
    assert(hm_get(m, "apple", &v) && v == 3);
    assert(hm_get(m, "pear", &v) && v == 5);
    assert(!hm_get(m, "plum", &v));
    hm_free(m);
    printf("ok  put and get\n");
}

static void test_update(void) {
    hashmap *m = hm_new();
    assert(hm_put(m, "apple", 3));
    assert(hm_put(m, "apple", 4));
    int v = 0;
    assert(hm_get(m, "apple", &v) && v == 4);
    assert(hm_count(m) == 1);
    hm_free(m);
    printf("ok  putting a key again updates it\n");
}

static void test_remove(void) {
    hashmap *m = hm_new();
    assert(hm_put(m, "a", 1) && hm_put(m, "b", 2));
    assert(hm_remove(m, "a"));
    assert(!hm_remove(m, "a"));
    int v = 0;
    assert(!hm_get(m, "a", &v));
    assert(hm_get(m, "b", &v) && v == 2);
    assert(hm_count(m) == 1);
    hm_free(m);
    printf("ok  remove\n");
}

static void test_keys_are_copied(void) {
    hashmap *m = hm_new();
    char key[] = "cat";
    assert(hm_put(m, key, 7));
    key[0] = 'b'; /* the caller changes its own string... */
    int v = 0;
    assert(hm_get(m, "cat", &v) && v == 7); /* ...and the map still has "cat" */
    assert(!hm_get(m, "bat", &v));
    hm_free(m);
    printf("ok  the map keeps its own copy of each key\n");
}

static void test_growth(void) {
    hashmap *m = hm_new();
    char key[16];
    for (int i = 0; i < 1000; i++) {
        snprintf(key, sizeof key, "key%d", i);
        assert(hm_put(m, key, i * i));
    }
    for (int i = 0; i < 1000; i++) {
        snprintf(key, sizeof key, "key%d", i);
        int v = -1;
        assert(hm_get(m, key, &v) && v == i * i);
    }
    printf("ok  1000 keys, %zu buckets, all found\n", hm_capacity(m));
    hm_free(m);
}

int main(void) {
    test_put_and_get();
    test_update();
    test_remove();
    test_keys_are_copied();
    test_growth();
    printf("all tests passed\n");
    return 0;
}
