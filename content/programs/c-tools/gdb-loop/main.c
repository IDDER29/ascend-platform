#include <stdio.h>

/* Sum the readings, skipping any marked -1 (a sensor that didn't answer). */
static int total(const int *readings, int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        if (readings[i] != -1) {
            sum += readings[i];
        }
    }
    return sum;
}

int main(void) {
    int readings[] = {12, 15, -1, 14, 900, 13};
    int n = sizeof readings / sizeof readings[0];
    printf("total: %d\n", total(readings, n));
    return 0;
}
