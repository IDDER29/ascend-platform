#include <stdio.h>

#define BLOCK 4096L

/* One ext4 extent: a run of logical blocks of the file, stored in a run of physical blocks on the disk. */
typedef struct {
    long logical;  /* first block of the file it covers */
    long length;   /* how many blocks */
    long physical; /* where the first of them is on the disk */
} extent;

/* The real extents of a sparse file on ext4, as filefrag -v reported them. */
static const extent extents[] = {
    {0, 4, 42847344},
    {100, 2, 21860959},
    {1000, 1, 22953284},
};

/* Which disk block holds this byte of the file? -1 means it's in a hole. */
static long disk_block(long offset) {
    long block = offset / BLOCK;
    for (size_t i = 0; i < sizeof extents / sizeof extents[0]; i++) {
        const extent *e = &extents[i];
        if (block >= e->logical && block < e->logical + e->length) {
            return e->physical + (block - e->logical);
        }
    }
    return -1;
}

int main(void) {
    long offsets[] = {0, 10000, 409700, 204800, 4096000};
    for (size_t i = 0; i < sizeof offsets / sizeof offsets[0]; i++) {
        long d = disk_block(offsets[i]);
        if (d < 0) {
            printf("byte %7ld: file block %4ld, in a hole (reads as zeros)\n", offsets[i], offsets[i] / BLOCK);
        } else {
            printf("byte %7ld: file block %4ld, disk block %ld\n", offsets[i], offsets[i] / BLOCK, d);
        }
    }
    return 0;
}
