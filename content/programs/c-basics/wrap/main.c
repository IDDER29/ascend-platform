#include <stdio.h>

int main(void) {
    unsigned char small = 250;
    small = small + 10;
    printf("%d\n", small);

    unsigned int counter = 0;
    counter = counter - 1;
    printf("%u\n", counter);
    return 0;
}
