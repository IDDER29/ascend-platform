#include <limits.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    (void) argv;
    int big = INT_MAX - 1 + argc;
    int shift = 31 + argc;
    int table[4] = {1, 2, 3, 4};
    int i = 3 + argc;

    int a = big + 1;      /* signed overflow */
    int b = 1 << shift;   /* shift by the width of int */
    table[i] = 0;         /* index 4 of a 4-element array */

    printf("%d %d %d\n", a, b, table[0]);
    return 0;
}
