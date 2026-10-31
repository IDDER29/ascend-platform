#include <stdio.h>

int main(void) {
    int scores[] = {95, 82, 64, 40};
    for (int i = 0; i < 4; i++) {
        int s = scores[i];
        if (s >= 90) {
            printf("%d: A\n", s);
        } else if (s >= 80) {
            printf("%d: B\n", s);
        } else if (s >= 50) {
            printf("%d: pass\n", s);
        } else {
            printf("%d: fail\n", s);
        }
    }
    return 0;
}
