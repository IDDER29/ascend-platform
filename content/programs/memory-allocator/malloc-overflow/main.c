#include <stdio.h>
#include <string.h>
#include "mymalloc.h"

int main(void) {
    char *a = my_malloc(16);
    char *b = my_malloc(16);
    printf("before: heap %s\n", my_heap_check() ? "consistent" : "CORRUPTED");
    strcpy(a, "this string is too long for 16 bytes"); /* 37 bytes into a 16-byte block */
    printf("after:  heap %s\n", my_heap_check() ? "consistent" : "CORRUPTED");
    my_heap_dump();
    (void) b;
    return 0;
}
