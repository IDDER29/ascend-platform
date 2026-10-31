#include <stdio.h>

int total = 0;   /* the one definition: external linkage */

void add(int amount) {
    total += amount;
    printf("added %d, total is now %d\n", amount, total);
}
