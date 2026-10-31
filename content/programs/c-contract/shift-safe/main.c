#include <stdint.h>
#include <stdio.h>

/* Rotate left: shift unsigned values, and keep every count below 32. */
static uint32_t rotl32(uint32_t x, unsigned n) {
    n &= 31;
    return (x << n) | (x >> ((32 - n) & 31));
}

int main(void) {
    printf("%08x\n", rotl32(0x80000001u, 1));
    printf("%08x\n", rotl32(0x12345678u, 8));
    printf("%08x\n", rotl32(0x12345678u, 32));
    printf("%u\n", 1u << 31);
    return 0;
}
