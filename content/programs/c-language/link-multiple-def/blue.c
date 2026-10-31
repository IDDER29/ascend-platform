#include <stdio.h>

int count = 0;          /* the same name, also external */

void blue_tick(void) {
    count++;
    printf("blue: %d\n", count);
}
