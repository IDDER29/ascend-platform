#include <stdio.h>

int square(int x) {
    return x * x;
}

int sum_squares(int a, int b) {
    return square(a) + square(b);
}

int main(void) {
    printf("%d\n", sum_squares(3, 4));
    return 0;
}
