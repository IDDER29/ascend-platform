#include <stdio.h>

/* Does any pair of elements add up to target? Check every pair. */
static long pairs_checked;

static int has_pair(const int *a, int n, int target) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            pairs_checked++;
            if (a[i] + a[j] == target) return 1;
        }
    }
    return 0;
}

int main(void) {
    static int a[16000];
    printf("%7s %12s %8s\n", "n", "pairs", "ratio");
    long previous = 0;
    for (int n = 1000; n <= 16000; n *= 2) {
        for (int i = 0; i < n; i++) a[i] = i;
        pairs_checked = 0;
        has_pair(a, n, -1); /* no pair adds to -1: the worst case */
        if (previous) {
            printf("%7d %12ld %8.2f\n", n, pairs_checked, (double) pairs_checked / (double) previous);
        } else {
            printf("%7d %12ld %8s\n", n, pairs_checked, "");
        }
        previous = pairs_checked;
    }
    return 0;
}
