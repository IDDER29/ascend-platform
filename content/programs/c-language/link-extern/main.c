#include <stdio.h>

/* Declarations: these exist, defined in another file. */
extern int total;
void add(int amount);

int main(void) {
    add(5);
    add(7);
    total += 100;   /* the same object counter.c uses */
    add(1);
    return 0;
}
