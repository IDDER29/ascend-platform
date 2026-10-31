#include <stdio.h>

static int count = 0;            /* private to red.c */

static void report(void) {       /* private too */
    printf("red: %d\n", count);
}

void red_tick(void) {
    count++;
    report();
}
