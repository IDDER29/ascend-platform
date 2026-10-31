#include <stdio.h>

int main(void) {
    int scores[4] = {10, 20, 30, 40};
    int extra = 7;
    int total = 0;
    for (int i = 0; i <= 4; i++) {
        total += scores[i];
    }
    printf("total = %d, extra = %d\n", total, extra);
    return 0;
}
