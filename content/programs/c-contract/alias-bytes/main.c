#include <stdio.h>

int main(void) {
    float f = 1.0f;
    const unsigned char *bytes = (const unsigned char *) &f;
    for (size_t i = 0; i < sizeof f; i++) {
        printf("%02X ", bytes[i]);
    }
    printf("\n");
    return 0;
}
