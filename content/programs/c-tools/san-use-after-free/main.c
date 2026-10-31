#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char *name = malloc(16);
    if (name == NULL) {
        return 1;
    }
    strcpy(name, "Grace");
    free(name);
    char first = name[0]; /* name was freed on the line above */
    printf("first letter: %c\n", first);
    return 0;
}
