#include <stdio.h>

int main(void) {
    char c = 'A';
    printf("%c is %d\n", c, c);
    printf("%c comes next\n", c + 1);
    printf("'7' - '0' = %d\n", '7' - '0');

    char lower = 'g';
    char upper = lower - 'a' + 'A';
    printf("%c -> %c\n", lower, upper);
    return 0;
}
