#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

/* A popular shortcut: subtract. */
int by_subtraction(const void *a, const void *b) {
    return *(const int *) a - *(const int *) b;
}

int main(void) {
    int v[] = { 5, INT_MIN, 2000000000, -3 };
    size_t n = sizeof v / sizeof v[0];
    qsort(v, n, sizeof v[0], by_subtraction);
    for (size_t i = 0; i < n; i++) {
        printf("%d\n", v[i]);
    }
    return 0;
}
