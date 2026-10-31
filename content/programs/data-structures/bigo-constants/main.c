#include <stdio.h>

/* Two made-up algorithms, by their exact step counts:
   A does 100 steps per element (linear, with a big constant),
   B does one step per pair of elements (quadratic, with a small one). */
int main(void) {
    printf("%6s %10s %10s  %s\n", "n", "A: 100n", "B: n*n", "fewer steps");
    int sizes[] = {10, 50, 100, 200, 1000, 10000};
    for (int k = 0; k < 6; k++) {
        long n = sizes[k];
        long a = 100 * n, b = n * n;
        printf("%6ld %10ld %10ld  %s\n", n, a, b, a < b ? "A" : a > b ? "B" : "same");
    }
    return 0;
}
