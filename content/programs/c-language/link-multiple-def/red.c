#include <stdio.h>

int count = 0;          /* no static: external linkage */

void red_tick(void) {
    count++;
    printf("red: %d\n", count);
}
