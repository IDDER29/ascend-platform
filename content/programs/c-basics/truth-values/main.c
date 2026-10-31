#include <stdio.h>

int main(void) {
    int x = 7;
    printf("%d\n", x > 3);
    printf("%d\n", x == 4);
    printf("%d\n", x > 3 && x < 5);
    printf("%d\n", x < 3 || x > 5);
    printf("%d\n", !x);
    return 0;
}
