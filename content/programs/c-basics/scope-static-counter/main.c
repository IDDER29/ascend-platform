#include <stdio.h>

int fresh(void) {
    int calls = 0;          /* made new on every call */
    calls = calls + 1;
    return calls;
}

int remembered(void) {
    static int calls = 0;   /* made once, kept between calls */
    calls = calls + 1;
    return calls;
}

int main(void) {
    for (int i = 0; i < 3; i++) {
        int a = fresh();
        int b = remembered();
        printf("fresh %d, remembered %d\n", a, b);
    }
    return 0;
}
