#include <stdio.h>
#include <stdlib.h>

/* qsort calls these with pointers to two elements.
   Return negative if a comes first, positive if b does, 0 if they tie. */
int ascending(const void *a, const void *b) {
    int x = *(const int *) a;
    int y = *(const int *) b;
    return (x > y) - (x < y);
}

int descending(const void *a, const void *b) {
    return ascending(b, a);
}

void print(const int *v, size_t n) {
    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
}

int main(void) {
    int v[] = { 42, -7, 19, 0, 3, 19 };
    size_t n = sizeof v / sizeof v[0];

    qsort(v, n, sizeof v[0], ascending);
    print(v, n);
    qsort(v, n, sizeof v[0], descending);
    print(v, n);
    return 0;
}
