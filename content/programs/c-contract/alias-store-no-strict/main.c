#include <stdio.h>

/* Store an int, then a float, then read the int back. */
int store_both(int *ip, float *fp) {
    *ip = 1;
    *fp = 2.0f;
    return *ip;
}

int main(void) {
    int x = 0;
    int result = store_both(&x, (float *) &x);
    printf("store_both returned %d\n", result);
    printf("x now holds %d\n", x);
    return 0;
}
