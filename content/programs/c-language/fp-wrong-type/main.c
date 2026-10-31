#include <stdio.h>
#include <stdlib.h>

/* Takes int pointers, not const void pointers. */
int compare(int *a, int *b) {
    return (*a > *b) - (*a < *b);
}

int main(void) {
    int v[] = { 3, 1, 2 };
    qsort(v, 3, sizeof v[0], compare);
    printf("%d %d %d\n", v[0], v[1], v[2]);
    return 0;
}
