#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Returns a new copy of s; the caller must free it. */
static char *copy(const char *s) {
    char *c = malloc(strlen(s) + 1);
    if (c != NULL) {
        strcpy(c, s);
    }
    return c;
}

int main(void) {
    for (int i = 0; i < 3; i++) {
        char *line = copy("a line of text");
        printf("%d: %s\n", i, line); /* never freed */
    }
    return 0;
}
