#ifndef UTIL_H
#define UTIL_H

/* A definition in a header: every .c file that includes it gets its own copy. */
int clamp(int x, int lo, int hi) {
    return x < lo ? lo : x > hi ? hi : x;
}

#endif
