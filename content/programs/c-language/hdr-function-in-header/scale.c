#include "util.h"

int scaled(int x) {
    return clamp(x * 4, 0, 10);
}
