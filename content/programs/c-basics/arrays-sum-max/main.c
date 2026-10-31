#include <stdio.h>

int main(void) {
    int temps[] = {14, 17, 21, 19, 12, 23};
    size_t n = sizeof temps / sizeof temps[0];

    int sum = 0;
    int max = temps[0];
    for (size_t i = 0; i < n; i++) {
        sum += temps[i];
        if (temps[i] > max) {
            max = temps[i];
        }
    }
    printf("%zu days, total %d, max %d, average %.1f\n", n, sum, max, (double)sum / n);
    return 0;
}
