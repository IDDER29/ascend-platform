#include <limits.h>
#include <stdckdint.h>
#include <stdio.h>

/* Check before adding: never computes an overflowing sum. */
static int add_would_overflow(int a, int b) {
    return (b > 0 && a > INT_MAX - b) || (b < 0 && a < INT_MIN - b);
}

int main(void) {
    printf("%d %d\n", add_would_overflow(INT_MAX, 1), add_would_overflow(100, 1));

    /* C23: ckd_add stores the wrapped result and returns true on overflow. */
    int sum;
    if (ckd_add(&sum, INT_MAX, 1)) {
        printf("ckd_add: overflow\n");
    }
    if (!ckd_add(&sum, 40, 2)) {
        printf("ckd_add: %d\n", sum);
    }
    return 0;
}
