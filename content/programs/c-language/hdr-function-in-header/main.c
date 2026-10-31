#include <stdio.h>
#include "util.h"

int scaled(int x);

int main(void) {
    printf("%d %d\n", clamp(15, 0, 10), scaled(3));
    return 0;
}
