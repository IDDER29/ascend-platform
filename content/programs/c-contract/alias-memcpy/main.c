#include <stdio.h>
#include <string.h>

int main(void) {
    float f = 1.0f;
    unsigned bits;
    memcpy(&bits, &f, sizeof bits);
    printf("the bits of 1.0f: 0x%08X\n", bits);
    return 0;
}
