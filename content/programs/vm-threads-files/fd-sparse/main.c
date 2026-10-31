#define _GNU_SOURCE
#include <fcntl.h>
#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>

#define BLOCK 4096L

int main(void) {
    const char *path = "/tmp/ascend-sparse.bin";
    int fd = open(path, O_RDWR | O_CREAT | O_TRUNC, 0600);
    if (fd < 0) {
        perror("open");
        return 1;
    }
    char block[BLOCK];
    for (long i = 0; i < BLOCK; i++) {
        block[i] = 'x';
    }
    /* Write 4 blocks at the start, 2 at block 100 and 1 at block 1000; never write in between. */
    long where[] = {0, 1, 2, 3, 100, 101, 1000};
    for (int i = 0; i < 7; i++) {
        if (pwrite(fd, block, BLOCK, where[i] * BLOCK) != BLOCK) {
            perror("pwrite");
            return 1;
        }
    }
    struct stat st;
    fstat(fd, &st);
    printf("size: %ld bytes, space used: %ld bytes\n", (long) st.st_size, (long) st.st_blocks * 512);

    /* Ask the file system where the data is. */
    off_t pos = 0;
    while ((pos = lseek(fd, pos, SEEK_DATA)) >= 0) {
        off_t hole = lseek(fd, pos, SEEK_HOLE);
        printf("data in blocks %ld to %ld\n", (long) (pos / BLOCK), (long) (hole / BLOCK - 1));
        pos = hole;
    }

    char c = '?';
    pread(fd, &c, 1, 50 * BLOCK); /* a byte in the hole */
    printf("a byte in block 50 reads as %d\n", c);
    close(fd);
    unlink(path);
    return 0;
}
