#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *copy_word(const char *w) {
    char *s = malloc(strlen(w) + 1);
    strcpy(s, w);
    return s;
}

int main(void) {
    for (int i = 0; i < 3; i++) {
        char *w = copy_word("leak");
        printf("%d: %s\n", i, w);
        /* nobody frees w */
    }
    return 0;
}
