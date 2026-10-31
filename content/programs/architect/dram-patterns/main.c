/* Read one byte from every 64-byte line of a 64 MiB buffer, far bigger than any cache:
   first in address order, then in a shuffled order. Same lines, same number of reads. */
#define _POSIX_C_SOURCE 200809L
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define BYTES (64u << 20)
#define LINE 64
#define LINES (BYTES / LINE)

static uint64_t rng = 88172645463325252u;
static uint64_t next_random(void) {
    rng ^= rng << 13;
    rng ^= rng >> 7;
    rng ^= rng << 17;
    return rng;
}

static double seconds(struct timespec a, struct timespec b) {
    return (double) (b.tv_sec - a.tv_sec) + (double) (b.tv_nsec - a.tv_nsec) / 1e9;
}

int main(void) {
    unsigned char *buf = malloc(BYTES);
    uint32_t *order = malloc(LINES * sizeof *order);
    if (buf == NULL || order == NULL) {
        return 1;
    }
    memset(buf, 1, BYTES); /* touch every page first, so page faults aren't timed */
    for (uint32_t i = 0; i < LINES; i++) {
        order[i] = i;
    }
    for (uint32_t i = LINES - 1; i > 0; i--) {
        uint32_t j = (uint32_t) (next_random() % (i + 1));
        uint32_t t = order[i];
        order[i] = order[j];
        order[j] = t;
    }

    struct timespec a, b;
    unsigned sum = 0;
    clock_gettime(CLOCK_MONOTONIC, &a);
    for (uint32_t i = 0; i < LINES; i++) {
        sum += buf[(size_t) i * LINE];
    }
    clock_gettime(CLOCK_MONOTONIC, &b);
    double in_order = seconds(a, b);

    clock_gettime(CLOCK_MONOTONIC, &a);
    for (uint32_t i = 0; i < LINES; i++) {
        sum += buf[(size_t) order[i] * LINE];
    }
    clock_gettime(CLOCK_MONOTONIC, &b);
    double shuffled = seconds(a, b);

    printf("%u lines of 64 bytes (64 MiB), sum %u\n", LINES, sum);
    printf("in address order: %6.2f ns per line\n", in_order * 1e9 / LINES);
    printf("shuffled order:   %6.2f ns per line\n", shuffled * 1e9 / LINES);
    free(order);
    free(buf);
    return 0;
}
