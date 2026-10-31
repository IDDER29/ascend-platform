#include <stdio.h>
#include "point.h"
#include "shapes.h"

int main(void) {
    struct circle c = { { 2, 3 }, 5 };
    printf("circle at (%d, %d), radius %d\n", c.centre.x, c.centre.y, c.radius);
    return 0;
}
