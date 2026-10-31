#include <stdio.h>

int main(void) {
    int i = 1;
    printf("%d %d\n", i++, i++); /* undefined: i changed twice, unsequenced */
    return 0;
}
