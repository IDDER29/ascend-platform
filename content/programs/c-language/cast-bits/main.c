#include <stdint.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    float f = 1.0f;
    uint32_t as_value = (uint32_t) f;  /* converts the value 1.0 to 1 */
    uint32_t as_bits;
    memcpy(&as_bits, &f, sizeof as_bits); /* copies the 4 bytes unchanged */
    printf("value: %u\n", as_value);
    printf("bits:  0x%08x\n", as_bits);
    return 0;
}
