#include <stdio.h>

#ifndef TIMES
#define TIMES 1
#endif

int main(void) {
#ifdef DEBUG
    printf("debug build of %s\n", __FILE__);
#endif
    for (int i = 0; i < TIMES; i++) {
        printf("hello, world\n");
    }
    return 0;
}
