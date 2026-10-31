#include <stdio.h>

int main(void) {
    int a, b;
    printf("Two numbers: ");
    if (scanf("%d %d", &a, &b) != 2) {
        printf("That wasn't two numbers.\n");
        return 1;
    }
    printf("%d + %d = %d\n", a, b, a + b);
    return 0;
}
