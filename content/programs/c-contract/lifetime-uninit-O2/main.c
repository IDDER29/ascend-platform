#include <stdio.h>

int busy(void) {
    volatile int scratch[8];
    for (int i = 0; i < 8; i++) {
        scratch[i] = 1000;
    }
    return scratch[0];
}

int total(const int *values, int n) {
    int sum;
    for (int i = 0; i < n; i++) {
        sum += values[i];
    }
    return sum;
}

int main(void) {
    int scores[] = {3, 4, 5};
    printf("total: %d\n", total(scores, 3));
    busy();
    printf("total: %d\n", total(scores, 3));
    return 0;
}
