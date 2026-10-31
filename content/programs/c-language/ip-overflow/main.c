#include <limits.h>
#include <stdio.h>

int main(void) {
    unsigned int u = UINT_MAX;
    u = u + 1; /* defined: wraps around to 0 */
    printf("UINT_MAX + 1 = %u\n", u);

    int i = INT_MAX;
    i = i + 1; /* undefined behaviour */
    printf("INT_MAX + 1 = %d\n", i);
    return 0;
}
