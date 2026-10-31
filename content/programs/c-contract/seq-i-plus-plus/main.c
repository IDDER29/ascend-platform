#include <stdio.h>

int main(void) {
    int i = 5;
    i = i++ + 1; /* two unsequenced writes to i: undefined */
    printf("i = %d\n", i);
    return 0;
}
