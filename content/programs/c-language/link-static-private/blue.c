#include <stdio.h>

static int count = 0;            /* a different count, private to blue.c */

static void report(void) {
    printf("blue: %d\n", count);
}

void blue_tick(void) {
    count++;
    report();
}
