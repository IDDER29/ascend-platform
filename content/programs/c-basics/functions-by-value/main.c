#include <stdio.h>

void try_to_reset(int n) {
    n = 0;
    printf("inside:  n = %d\n", n);
}

int reset(int n) {
    (void)n;
    return 0;
}

int main(void) {
    int score = 42;
    try_to_reset(score);
    printf("after try_to_reset: score = %d\n", score);
    score = reset(score);
    printf("after reset:        score = %d\n", score);
    return 0;
}
