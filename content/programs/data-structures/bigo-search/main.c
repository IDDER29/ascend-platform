#include <stdio.h>
#include <stdlib.h>

static long steps; /* how many times an element was compared */

/* Look at each element in turn. */
static int linear_search(const int *a, int n, int key) {
    for (int i = 0; i < n; i++) {
        steps++;
        if (a[i] == key) return i;
    }
    return -1;
}

/* a must be sorted: halve the range that could hold key each time. */
static int binary_search(const int *a, int n, int key) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        steps++;
        if (a[mid] == key) return mid;
        if (a[mid] < key) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main(void) {
    printf("%9s %12s %12s\n", "n", "linear", "binary");
    for (int n = 1000; n <= 1024000; n *= 4) {
        int *a = malloc(sizeof *a * (size_t) n);
        if (a == NULL) return 1;
        for (int i = 0; i < n; i++) a[i] = 2 * i; /* sorted even numbers */

        /* The worst case for both: a key that isn't there (an odd number). */
        steps = 0;
        linear_search(a, n, 2 * n + 1);
        long lin = steps;
        steps = 0;
        binary_search(a, n, 2 * n + 1);
        long bin = steps;
        printf("%9d %12ld %12ld\n", n, lin, bin);
        free(a);
    }
    return 0;
}
