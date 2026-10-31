#include <stdlib.h>
#include "point.h"

/* The definitions: compiled once, here. */
struct point point_add(struct point a, struct point b) {
    struct point sum = { a.x + b.x, a.y + b.y };
    return sum;
}

int point_manhattan(struct point p) {
    return abs(p.x) + abs(p.y);
}
