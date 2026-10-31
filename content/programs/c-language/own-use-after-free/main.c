#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *scores = malloc(3 * sizeof *scores);
    if (scores == NULL) {
        return 1;
    }
    scores[0] = 90;
    int *best = &scores[0]; /* a borrowed pointer into the block */
    free(scores);
    printf("best: %d\n", *best);
    return 0;
}
