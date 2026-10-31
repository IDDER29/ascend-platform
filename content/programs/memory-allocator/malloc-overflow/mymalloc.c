#define _DEFAULT_SOURCE /* for MAP_ANONYMOUS */
#include "mymalloc.h"

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>

/*
 * Every block is: an 8-byte header, the payload, an 8-byte footer. Header and footer
 * both hold the block's total size (a multiple of 16) with bit 0 set when it's in use.
 * The footer lets free() find the block before this one, so free neighbours can merge.
 *
 *   | header | payload ...                | footer | header | payload ... | footer | ...
 */
#define ARENA_SIZE (1u << 20)
#define ALIGN 16
#define WORD 8
#define MIN_BLOCK 32 /* header + 16 bytes of payload + footer */

static unsigned char *arena;   /* the region from mmap */
static unsigned char *first;   /* the first block's header */
static unsigned char *end;     /* the end marker: a header with size 0, in use */

static size_t get_size(const unsigned char *h) { return *(const uint64_t *) h & ~(uint64_t) 0xF; }
static int in_use(const unsigned char *h) { return (int) (*(const uint64_t *) h & 1); }
static void put(unsigned char *at, size_t size, int used) { *(uint64_t *) at = size | (uint64_t) used; }
static unsigned char *footer(unsigned char *h) { return h + get_size(h) - WORD; }
static unsigned char *next(unsigned char *h) { return h + get_size(h); }
static unsigned char *payload(unsigned char *h) { return h + WORD; }
static unsigned char *header_of(void *p) { return (unsigned char *) p - WORD; }

static void set_block(unsigned char *h, size_t size, int used) {
    put(h, size, used);
    put(h + size - WORD, size, used);
}

static int init(void) {
    arena = mmap(NULL, ARENA_SIZE, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    if (arena == MAP_FAILED) {
        arena = NULL;
        return 0;
    }
    /* Headers sit 8 bytes before a 16-byte boundary, so every payload is 16-byte aligned. */
    first = arena + WORD;
    end = arena + ARENA_SIZE - WORD;
    set_block(first, (size_t) (end - first), 0); /* one big free block */
    put(end, 0, 1);
    return 1;
}

void *my_malloc(size_t size) {
    if (arena == NULL && !init()) {
        return NULL;
    }
    if (size == 0 || size > ARENA_SIZE) {
        return NULL;
    }
    size_t need = (size + 2 * WORD + ALIGN - 1) / ALIGN * ALIGN; /* add header and footer, round up */
    if (need < MIN_BLOCK) {
        need = MIN_BLOCK;
    }
    for (unsigned char *h = first; get_size(h) != 0; h = next(h)) { /* first fit */
        if (in_use(h) || get_size(h) < need) {
            continue;
        }
        size_t have = get_size(h);
        if (have - need >= MIN_BLOCK) { /* split: the rest stays free */
            set_block(h, need, 1);
            set_block(h + need, have - need, 0);
        } else {
            set_block(h, have, 1); /* too little left over to split: give it all */
        }
        return payload(h);
    }
    return NULL;
}

void my_free(void *p) {
    if (p == NULL) {
        return;
    }
    unsigned char *h = header_of(p);
    if (!in_use(h)) {
        fprintf(stderr, "my_free: double free of the block at offset %zu\n", (size_t) (h - arena));
        abort();
    }
    size_t size = get_size(h);
    unsigned char *after = next(h);
    if (!in_use(after)) { /* merge with the free block after */
        size += get_size(after);
    }
    if (h != first) {
        unsigned char *before_footer = h - WORD;
        if (!in_use(before_footer)) { /* merge with the free block before */
            h -= get_size(before_footer);
            size += get_size(h);
        }
    }
    set_block(h, size, 0);
}

void *my_realloc(void *p, size_t size) {
    if (p == NULL) {
        return my_malloc(size);
    }
    if (size == 0) {
        my_free(p);
        return NULL;
    }
    size_t old = get_size(header_of(p)) - 2 * WORD;
    void *q = my_malloc(size);
    if (q == NULL) {
        return NULL; /* the old block is still valid */
    }
    memcpy(q, p, old < size ? old : size);
    my_free(p);
    return q;
}

/* A block whose size can't be right: too small, or running past the end marker. */
static int broken(const unsigned char *h) {
    size_t size = get_size(h);
    return size < MIN_BLOCK || size > (size_t) (end - h);
}

void my_heap_dump(void) {
    if (arena == NULL) {
        return;
    }
    for (unsigned char *h = first; get_size(h) != 0; h = next(h)) {
        if (broken(h)) {
            printf("  offset %7zu  a header that makes no sense: the heap is corrupted\n", (size_t) (h - arena));
            return;
        }
        printf("  offset %7zu  %7zu bytes  %s\n", (size_t) (h - arena), get_size(h), in_use(h) ? "used" : "free");
    }
}

int my_heap_check(void) {
    if (arena == NULL) {
        return 1;
    }
    int previous_free = 0;
    for (unsigned char *h = first; get_size(h) != 0; h = next(h)) {
        if (broken(h) || get_size(h) % ALIGN != 0 || *(uint64_t *) h != *(uint64_t *) footer(h)) {
            return 0; /* header and footer disagree: something wrote over them */
        }
        if (!in_use(h) && previous_free) {
            return 0; /* two free neighbours should have been merged */
        }
        previous_free = !in_use(h);
    }
    return 1;
}
