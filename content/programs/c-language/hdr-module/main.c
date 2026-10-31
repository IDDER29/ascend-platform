#include <stdio.h>
#include "point.h"

int main(void) {
    struct point a = { 3, -4 };
    struct point b = { -1, 1 };
    struct point c = point_add(a, b);
    printf("(%d, %d), distance %d\n", c.x, c.y, point_manhattan(c));
    return 0;
}
