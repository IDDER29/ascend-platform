#include <stdio.h>

int sign(int x) {
    if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    }
}

int main(void) {
    printf("%d\n", sign(0));
    return 0;
}
