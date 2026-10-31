#include <stdio.h>

/* The "simplified" max from the commit that broke the tests. */
int max(const int *a, int n) {
    int best = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] > best) {
            best = a[i];
        }
    }
    return best;
}

int main(void) {
    int a[] = {3, 9, 4};
    int neg[] = {-5, -2, -8};
    printf("max of 3 9 4: %d\n", max(a, 3));
    printf("max of -5 -2 -8: %d\n", max(neg, 3));
    return 0;
}
