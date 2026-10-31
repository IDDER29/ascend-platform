#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    int *squares = malloc(n * sizeof *squares);
    if (squares == NULL) {
        return 1;
    }
    for (int i = 0; i <= n; i++) { /* one step too far */
        squares[i] = i * i;
    }
    printf("last square: %d\n", squares[n - 1]);
    free(squares);
    return 0;
}
