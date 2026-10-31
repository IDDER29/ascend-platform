#include <stdio.h>

int start(void) {
    return 10;
}

static int counter = start();   /* set up before main runs? */

int main(void) {
    printf("%d\n", counter);
    return 0;
}
