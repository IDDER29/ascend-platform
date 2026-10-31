#include "stats.h"

int sum(const int *values, int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += values[i];
    }
    return total;
}

int largest(const int *values, int n) {
    int best = values[0];
    for (int i = 1; i < n; i++) {
        if (values[i] > best) {
            best = values[i];
        }
    }
    return best;
}
