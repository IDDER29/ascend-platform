/* A set-associative cache simulator with LRU replacement. Usage: ./prog SIZE LINE WAYS < trace
   Each trace line is "R address" or "W address" (hex or decimal). Prints the hits, the misses and
   how many of the misses were compulsory (the first touch of a line). */
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#define MAX_LINES_SEEN 65536

typedef struct {
    bool valid;
    uint64_t tag;
    uint64_t last_used; /* for LRU: the time of the last access */
} line;

static int log2_exact(unsigned n) {
    int bits = 0;
    while ((1u << bits) < n) {
        bits++;
    }
    return (1u << bits) == n ? bits : -1;
}

int main(int argc, char *argv[]) {
    if (argc != 4) {
        fprintf(stderr, "usage: %s SIZE LINE WAYS < trace\n", argv[0]);
        return 2;
    }
    unsigned size = (unsigned) atoi(argv[1]), line_size = (unsigned) atoi(argv[2]), ways = (unsigned) atoi(argv[3]);
    int offset_bits = log2_exact(line_size);
    if (offset_bits < 0 || log2_exact(ways) < 0 || log2_exact(size) < 0 || line_size * ways > size) {
        fprintf(stderr, "sizes must be powers of two, with room for at least one set\n");
        return 2;
    }
    unsigned sets = size / (line_size * ways);
    int index_bits = log2_exact(sets);
    line *cache = calloc((size_t) sets * ways, sizeof *cache);
    uint64_t *seen = calloc(MAX_LINES_SEEN, sizeof *seen); /* line numbers already touched */
    if (cache == NULL || seen == NULL) {
        return 1;
    }
    size_t n_seen = 0;
    unsigned long hits = 0, misses = 0, compulsory = 0, time = 0;
    char op;
    unsigned long long addr;
    while (scanf(" %c %lli", &op, &addr) == 2) {
        time++;
        uint64_t index = (addr >> offset_bits) & (sets - 1);
        uint64_t tag = addr >> (offset_bits + index_bits);
        line *set = &cache[index * ways];
        int found = -1;
        for (unsigned w = 0; w < ways; w++) {
            if (set[w].valid && set[w].tag == tag) {
                found = (int) w;
            }
        }
        if (found >= 0) {
            hits++;
            set[found].last_used = time;
            continue;
        }
        misses++;
        uint64_t line_no = addr >> offset_bits;
        bool first = true;
        for (size_t i = 0; i < n_seen; i++) {
            if (seen[i] == line_no) {
                first = false;
                break;
            }
        }
        if (first) {
            compulsory++;
            if (n_seen < MAX_LINES_SEEN) {
                seen[n_seen++] = line_no;
            }
        }
        unsigned victim = 0; /* an empty way, or the least recently used one */
        for (unsigned w = 0; w < ways; w++) {
            if (!set[w].valid) {
                victim = w;
                break;
            }
            if (set[w].last_used < set[victim].last_used) {
                victim = w;
            }
        }
        set[victim] = (line){true, tag, time};
    }
    printf("%u sets of %u ways, %u-byte lines\n", sets, ways, line_size);
    printf("%lu accesses: %lu hits, %lu misses (%lu compulsory), hit rate %.1f%%\n", time, hits, misses, compulsory,
           time ? 100.0 * (double) hits / (double) time : 0.0);
    free(seen);
    free(cache);
    return 0;
}
