#include <stdio.h>

static int counter = 0;

static int next(void) {
    counter++;
    return counter;
}

int main(void) {
    /* Each call runs whole, but which runs first is unspecified. */
    int d = next() - next();
    printf("d = %d\n", d);
    return 0;
}
