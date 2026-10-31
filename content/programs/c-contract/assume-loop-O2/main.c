#include <stdio.h>

/* Does any n in 1..limit make n * n end in the digits 2 (n*n % 10 == 2)? None can. */
int search(unsigned limit) {
    unsigned n = 1;
    while (n * n % 10 != 2) {
        n++;
        if (n > limit) n = 1;
    }
    return 1;
}

int main(void) {
    printf("found: %d\n", search(1000));
    return 0;
}
