#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include "mymalloc.h"

int main(void) {
    /* 1. Blocks are aligned and don't overlap. */
    char *a = my_malloc(10);
    char *b = my_malloc(100);
    char *c = my_malloc(10);
    assert(a && b && c);
    assert((uintptr_t) a % 16 == 0 && (uintptr_t) b % 16 == 0 && (uintptr_t) c % 16 == 0);
    memset(a, 'a', 10);
    memset(b, 'b', 100);
    memset(c, 'c', 10);
    assert(a[9] == 'a' && b[0] == 'b' && b[99] == 'b' && c[0] == 'c');
    printf("three blocks:\n");
    my_heap_dump();

    /* 2. Freeing the middle block leaves a hole that the next small request reuses. */
    my_free(b);
    char *d = my_malloc(50);
    assert(d == b);
    printf("after free(b) and malloc(50):\n");
    my_heap_dump();

    /* 3. Freeing everything merges it all back into one free block. */
    my_free(a);
    my_free(d);
    my_free(c);
    printf("after freeing everything:\n");
    my_heap_dump();
    assert(my_heap_check());

    /* 4. realloc keeps the contents. */
    char *s = my_malloc(6);
    strcpy(s, "hello");
    s = my_realloc(s, 4000);
    assert(s && strcmp(s, "hello") == 0);
    my_free(s);

    /* 5. A request that can't fit returns NULL instead of crashing. */
    assert(my_malloc(2u << 20) == NULL);
    assert(my_heap_check());
    printf("all tests passed\n");
    return 0;
}
