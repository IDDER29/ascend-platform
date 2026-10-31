#include <limits.h>
#include <stdio.h>

int main(void) {
    int big = INT_MAX;
    int shift = 40;
    printf("big + 1 = %d\n", big + 1);
    printf("1 << shift = %d\n", 1 << shift);
    printf("finished\n");
    return 0;
}
