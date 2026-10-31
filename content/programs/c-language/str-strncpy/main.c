#include <stdio.h>
#include <string.h>

int main(void) {
    char word[4];
    strncpy(word, "abcdef", sizeof word); /* copies a, b, c, d and stops: no zero */
    printf("%s\n", word);
    return 0;
}
