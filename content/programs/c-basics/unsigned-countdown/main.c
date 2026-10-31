#include <stdio.h>

int main(void) {
    int printed = 0;
    for (unsigned int i = 3; i >= 0; i--) {
        printf("%u\n", i);
        if (++printed == 6) {
            printf("stopped by hand: i >= 0 is always true for unsigned\n");
            break;
        }
    }
    return 0;
}
