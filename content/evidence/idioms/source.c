#include <stdio.h>

int scale(int x) {
    return x * 5 + 3;
}

unsigned eighth(unsigned x) {
    return x / 8;
}

int clamp(int x) {
    return x < 0 ? 0 : x;
}

int is_zero(int x) {
    return x == 0;
}

int main(void) {
    printf("%d %u %d %d\n", scale(4), eighth(100), clamp(-7), is_zero(0));
    return 0;
}
