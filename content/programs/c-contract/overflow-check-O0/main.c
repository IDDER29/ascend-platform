#include <limits.h>
#include <stdio.h>

/* Meant to say whether x + 1 overflows. */
__attribute__((noinline)) static int will_overflow(int x) {
    return x + 1 < x;
}

int main(int argc, char *argv[]) {
    (void) argv;
    int x = INT_MAX - 1 + argc; /* INT_MAX, read at run time */
    printf("will_overflow(INT_MAX) = %d\n", will_overflow(x));
    return 0;
}
