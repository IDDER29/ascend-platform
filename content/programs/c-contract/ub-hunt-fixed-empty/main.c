#include <stdio.h>

#define MAX_SCORES 8

/* A letter for a score. String literals live for the whole program, so returning one is safe. */
const char *grade(int score) {
    if (score >= 90) {
        return "A";
    }
    if (score >= 70) {
        return "B";
    }
    return "C";
}

int main(void) {
    int scores[MAX_SCORES];
    int n = 0;
    int value;
    while (scanf("%d", &value) == 1) {
        if (value < 0 || value > 100) {
            printf("ignoring %d: scores go from 0 to 100\n", value);
        } else if (n == MAX_SCORES) {
            printf("ignoring %d: only %d scores fit\n", value, MAX_SCORES);
        } else {
            scores[n++] = value;
        }
    }
    if (n == 0) {
        printf("no scores\n");
        return 1;
    }

    int total = 0;
    int best = scores[0];
    for (int i = 0; i < n; i++) {
        total += scores[i]; /* at most 8 x 100, far below INT_MAX */
        if (scores[i] > best) {
            best = scores[i];
        }
    }
    long long bonus = 1LL << (best / 3); /* best / 3 is at most 33, and 1LL has 63 value bits */

    printf("scores: %d\n", n);
    printf("average: %d\n", total / n);
    printf("best: %d (%s), bonus %lld\n", best, grade(best), bonus);
    return 0;
}
