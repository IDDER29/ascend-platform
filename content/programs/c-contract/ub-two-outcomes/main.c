#include <limits.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    (void) argv;
    /* argc is 1 here; using it stops gcc from working the answers out
       while compiling, so the CPU really does the arithmetic. */
    int big = INT_MAX - 1 + argc;   /* INT_MAX */
    int small = INT_MIN + argc - 1; /* INT_MIN */
    int minus_one = -argc;          /* -1 */

    printf("INT_MAX + 1 = %d\n", big + 1);
    fflush(stdout);
    printf("INT_MIN / -1 = %d\n", small / minus_one);
    return 0;
}
