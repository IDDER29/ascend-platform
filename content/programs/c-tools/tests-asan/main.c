#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "strutil.h"

int main(void) {
    char *word = malloc(6);
    if (word == NULL) {
        return 1;
    }
    strcpy(word, "stack");
    char out[6];
    reversed(word, out);
    assert(strcmp(out, "kcats") == 0);
    printf("all tests passed\n");
    free(word);
    return 0;
}
