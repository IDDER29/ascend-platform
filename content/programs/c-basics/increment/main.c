#include <stdio.h>

int main(void) {
    int i = 5;
    int a = i++;
    int b = ++i;
    printf("a = %d, b = %d, i = %d\n", a, b, i);

    int total = 10;
    total += 5;
    total *= 2;
    total -= 1;
    printf("total = %d\n", total);
    return 0;
}
