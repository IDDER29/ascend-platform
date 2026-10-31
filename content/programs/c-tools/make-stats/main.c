#include <stdio.h>
#include "stats.h"

int main(void) {
    int values[] = {4, 8, 15, 16, 23, 42};
    int n = sizeof values / sizeof values[0];
    printf("sum %d, largest %d, room for %d\n", sum(values, n), largest(values, n), MAX_VALUES);
    return 0;
}
