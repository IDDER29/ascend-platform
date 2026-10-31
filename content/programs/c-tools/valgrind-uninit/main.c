#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *counts = malloc(4 * sizeof *counts);
    if (counts == NULL) {
        return 1;
    }
    counts[0] = 3;
    counts[1] = 5;
    counts[2] = 2; /* counts[3] is never set */
    int best = 0;
    for (int i = 0; i < 4; i++) {
        if (counts[i] > best) {
            best = counts[i];
        }
    }
    printf("best = %d\n", best);
    free(counts);
    return 0;
}
