#include <stdio.h>
#include <string.h>

#define MAX_SCORES 8

/* A letter for a score. */
const char *grade(int score) {
    char label[8];
    if (score >= 90) {
        strcpy(label, "A");
    } else if (score >= 70) {
        strcpy(label, "B");
    } else {
        strcpy(label, "C");
    }
    return label;
}

int main(void) {
    int scores[MAX_SCORES];
    int n = 0;
    while (n <= MAX_SCORES && scanf("%d", &scores[n]) == 1) {
        n++;
    }

    int total;
    int best = scores[0];
    for (int i = 0; i < n; i++) {
        total += scores[i];
        if (scores[i] > best) {
            best = scores[i];
        }
    }
    int bonus = 1 << (best / 3); /* the bonus doubles every 3 points */

    printf("scores: %d\n", n);
    printf("average: %d\n", total / n);
    printf("best: %d (%s), bonus %d\n", best, grade(best), bonus);
    return 0;
}
