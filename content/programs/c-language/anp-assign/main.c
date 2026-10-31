#include <stdio.h>

int main(void) {
    int a[3] = {1, 2, 3};
    int b[3] = {4, 5, 6};
    a = b;
    printf("%d\n", a[0]);
    return 0;
}
