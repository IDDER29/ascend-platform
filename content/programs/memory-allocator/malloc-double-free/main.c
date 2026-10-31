#include <stdio.h>
#include "mymalloc.h"

int main(void) {
    char *name = my_malloc(32);
    snprintf(name, 32, "%s", "Ada");
    printf("name: %s\n", name);
    fflush(stdout);
    my_free(name);
    /* ... much later, another part of the program frees it again ... */
    my_free(name);
    printf("not reached\n");
    return 0;
}
