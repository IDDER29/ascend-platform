/* How long one load takes, by working-set size. A random cycle of pointers, one per 64-byte line,
   is followed so every load depends on the one before: no overlap, no prefetching help. */
#define _POSIX_C_SOURCE 200809L
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define LINE 64
#define STEPS 2000000L

static uint64_t rng = 88172645463325252u;
static uint64_t next_random(void) { /* xorshift64: fixed seed, same cycle every run */
    rng ^= rng << 13;
    rng ^= rng >> 7;
    rng ^= rng << 17;
    return rng;
}

static double ns_per_load(size_t bytes) {
    size_t n = bytes / LINE;
    char *mem = aligned_alloc(LINE, n * LINE);
    size_t *order = malloc(n * sizeof *order);
    if (mem == NULL || order == NULL) {
        exit(1);
    }
    for (size_t i = 0; i < n; i++) {
        order[i] = i;
    }
    for (size_t i = n - 1; i > 0; i--) { /* Sattolo's shuffle: one cycle through every line */
        size_t j = next_random() % i;
        size_t t = order[i];
        order[i] = order[j];
        order[j] = t;
    }
    for (size_t i = 0; i < n; i++) {
        *(void **) (mem + order[i] * LINE) = mem + order[(i + 1) % n] * LINE;
    }
    void **p = (void **) mem;
    for (long i = 0; i < (long) n; i++) { /* warm up: one lap */
        p = *p;
    }
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &a);
    for (long i = 0; i < STEPS; i++) {
        p = *p;
    }
    clock_gettime(CLOCK_MONOTONIC, &b);
    if (p == NULL) {
        puts("impossible"); /* uses p, so the loop can't be removed */
    }
    free(order);
    free(mem);
    return ((b.tv_sec - a.tv_sec) * 1e9 + (b.tv_nsec - a.tv_nsec)) / STEPS;
}

int main(void) {
    size_t sizes[] = {16u << 10, 32u << 10, 128u << 10, 512u << 10, 1u << 20, 4u << 20, 8u << 20, 32u << 20, 64u << 20};
    for (size_t k = 0; k < sizeof sizes / sizeof sizes[0]; k++) {
        double ns = ns_per_load(sizes[k]);
        if (sizes[k] < (1u << 20)) {
            printf("%6zu KiB  %6.1f ns per load\n", sizes[k] >> 10, ns);
        } else {
            printf("%6zu MiB  %6.1f ns per load\n", sizes[k] >> 20, ns);
        }
    }
    return 0;
}
