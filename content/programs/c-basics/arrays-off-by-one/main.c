#include <stdio.h>

#define N 5

int main(void) {
    int squares[N];
    for (int i = 0; i <= N; i++) {
        squares[i] = i * i;
    }
    printf("last square: %d\n", squares[N - 1]);
    return 0;
}
