#include <limits.h>
#include <stdio.h>

int main(void) {
    /* Each of these is implementation-defined: the answer is the
       compiler's documented choice for this target. */
    printf("sizeof(int) = %zu, sizeof(long) = %zu\n", sizeof(int), sizeof(long));
    printf("CHAR_MIN = %d, so plain char is %s\n", CHAR_MIN, CHAR_MIN < 0 ? "signed" : "unsigned");
    printf("-8 >> 1 = %d\n", -8 >> 1);

    int big = 200;
    signed char c = (signed char) big; /* out of range for signed char */
    printf("(signed char) 200 = %d\n", c);
    return 0;
}
