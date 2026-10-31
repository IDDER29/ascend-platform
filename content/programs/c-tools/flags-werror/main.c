#include <stdio.h>

int count = 0;

/* Twice the average of n scores, rounded down. */
int average(const int *scores, int n) {
    long total = 0;
    for (int i = 0; i < n; i++) {
        int count = scores[i];  /* a second "count" */
        total += count;
    }
    int avg = total / n;        /* long into int */
    unsigned char doubled = avg * 2;  /* int into unsigned char */
    return doubled;
}

int main(void) {
    int scores[] = {200, 150, 100};
    printf("twice the average: %d\n", average(scores, 3));
    printf("count: %d\n", count);
    return 0;
}
