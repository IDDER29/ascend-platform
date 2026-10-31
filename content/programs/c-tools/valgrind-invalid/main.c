#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *scores = malloc(5 * sizeof *scores);
    if (scores == NULL) {
        return 1;
    }
    for (int i = 0; i <= 5; i++) {
        scores[i] = i * 10;
    }
    int total = 0;
    for (int i = 0; i <= 5; i++) {
        total += scores[i];
    }
    printf("total = %d\n", total);
    free(scores);
    return 0;
}
