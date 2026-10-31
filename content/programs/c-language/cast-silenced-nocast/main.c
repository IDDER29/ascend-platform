#include <stdio.h>

int main(void) {
    double price = 1.5;
    int *p = &price;
    printf("price through an int pointer: %d\n", *p);
    return 0;
}
