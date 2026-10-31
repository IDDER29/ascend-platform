#include <stdio.h>

int main(void) {
    double a = 0.1 + 0.2;
    printf("%f\n", a);
    printf("%.17f\n", a);
    if (a == 0.3) {
        printf("equal\n");
    } else {
        printf("not equal\n");
    }
    return 0;
}
