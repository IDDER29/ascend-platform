#include <stdio.h>

int main(void) {
    const int limit = 10;
    int *p = (int *) &limit; /* casts away const */
    *p = 20;                 /* undefined behaviour */
    printf("limit = %d, *p = %d\n", limit, *p);
    return 0;
}
