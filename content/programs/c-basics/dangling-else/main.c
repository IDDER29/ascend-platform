#include <stdio.h>

int main(void) {
    int a = 0;
    int b = 5;
    if (a > 0)
        if (b > 0)
            printf("both positive\n");
    else
        printf("a is not positive\n");
    printf("done\n");
    return 0;
}
