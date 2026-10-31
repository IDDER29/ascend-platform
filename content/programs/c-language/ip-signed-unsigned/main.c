#include <stdio.h>

int main(void) {
    int a = -1;
    unsigned int b = 1;
    if (a < b) {
        printf("-1 < 1\n");
    } else {
        printf("-1 is not less than 1u\n");
    }
    printf("-1 as unsigned: %u\n", (unsigned int) a);
    return 0;
}
