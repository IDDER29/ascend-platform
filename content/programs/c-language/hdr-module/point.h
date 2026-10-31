#ifndef POINT_H
#define POINT_H

/* What other files need to know: the type, and the functions' declarations. */
struct point {
    int x;
    int y;
};

struct point point_add(struct point a, struct point b);
int point_manhattan(struct point p);

#endif
