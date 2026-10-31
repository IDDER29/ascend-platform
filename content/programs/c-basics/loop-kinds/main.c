#include <stdio.h>

int main(void) {
    int sum = 0;
    for (int i = 1; i <= 5; i++) {
        sum += i;
    }
    printf("for: %d\n", sum);

    int n = 3;
    while (n > 0) {
        printf("while: %d\n", n);
        n--;
    }

    int k = 10;
    do {
        printf("do: %d\n", k);
        k++;
    } while (k < 5);
    return 0;
}
