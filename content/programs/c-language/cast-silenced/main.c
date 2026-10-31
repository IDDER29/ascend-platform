#include <stdio.h>

int main(void) {
    double price = 1.5;
    int *p = (int *) &price; /* without the cast, gcc refuses this line */
    printf("price through an int pointer: %d\n", *p);
    return 0;
}
