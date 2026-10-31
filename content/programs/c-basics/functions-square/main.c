#include <stdio.h>

int square(int n);   /* a declaration: the name, what it takes, what it gives back */

int main(void) {
    int a = square(4);
    int b = square(a - 10);
    printf("%d %d %d\n", a, b, square(square(2)));
    return 0;
}

int square(int n) {  /* the definition: the body */
    return n * n;
}
