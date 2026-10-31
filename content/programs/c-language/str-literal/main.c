#include <stdio.h>

int main(void) {
    char copy[] = "hello"; /* an array: your own writable copy */
    char *lit = "hello";   /* a pointer to the literal itself */
    copy[0] = 'H';
    printf("%s\n", copy);
    fflush(stdout);        /* show that line before anything goes wrong */
    lit[0] = 'H';          /* writing to a string literal */
    printf("%s\n", lit);
    return 0;
}
