#include <stdio.h>

int counter = 7;                  /* initialised global */
int table[1000];                  /* zero-initialised global */
static int hidden = 3;            /* only this file can see it */
const char greeting[] = "hello";  /* read-only */

static int twice(int x) {
    return x * 2;
}

int main(void) {
    counter += twice(hidden) + table[0];
    printf("%s %d\n", greeting, counter);
    return 0;
}
