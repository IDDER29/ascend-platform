#include <stdio.h>

static int a(void) {
    printf("a runs\n");
    return 1;
}

static int b(void) {
    printf("b runs\n");
    return 2;
}

static int add(int x, int y) {
    return x + y;
}

int main(void) {
    /* The order the two arguments are evaluated in is unspecified. */
    int sum = add(a(), b());
    printf("sum = %d\n", sum);
    return 0;
}
