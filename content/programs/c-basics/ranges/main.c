#include <limits.h>
#include <stdio.h>

int main(void) {
    printf("int goes from %d to %d\n", INT_MIN, INT_MAX);
    printf("unsigned int goes up to %u\n", UINT_MAX);
    printf("signed char goes from %d to %d\n", SCHAR_MIN, SCHAR_MAX);
    return 0;
}
