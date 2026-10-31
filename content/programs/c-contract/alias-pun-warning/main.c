#include <stdio.h>

int main(void) {
    float f = 1.0f;
    unsigned bits = *(unsigned *) &f;
    printf("the bits of 1.0f: 0x%08X\n", bits);
    return 0;
}
