#include <stdio.h>
#include <string.h>

int main(void) {
    char word[] = "hello";

    printf("sizeof: %zu, strlen: %zu\n", sizeof word, strlen(word));

    int n = 0;
    while (word[n] != '\0') {
        printf("word[%d] = '%c' (%d)\n", n, word[n], word[n]);
        n++;
    }
    printf("word[%d] = %d, the end marker\n", n, word[n]);
    return 0;
}
