#define _DEFAULT_SOURCE
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/resource.h>
#include <unistd.h>

#define PAGE 4096L
#define PAGES 400L

static void faults(long *minor, long *major) {
    struct rusage u;
    getrusage(RUSAGE_SELF, &u);
    *minor = u.ru_minflt;
    *major = u.ru_majflt;
}

/* Map the file, read one byte per page, and report the faults that cost. */
static void read_mapped(int fd, int advice, const char *label) {
    /* Drop the file's pages from the page cache, so the data must come from the disk. */
    posix_fadvise(fd, 0, 0, POSIX_FADV_DONTNEED);
    char *p = mmap(NULL, PAGES * PAGE, PROT_READ, MAP_SHARED, fd, 0);
    if (p == MAP_FAILED) {
        perror("mmap");
        return;
    }
    madvise(p, PAGES * PAGE, advice);
    long minor0, major0, minor1, major1;
    faults(&minor0, &major0);
    long sum = 0;
    for (long i = 0; i < PAGES * PAGE; i += PAGE) {
        sum += p[i];
    }
    faults(&minor1, &major1);
    printf("%-34s major faults %3ld, minor faults %3ld\n", label, major1 - major0, minor1 - minor0);
    munmap(p, PAGES * PAGE);
    (void) sum;
}

int main(void) {
    /* A real file on the disk: /tmp here is in RAM (tmpfs), which never has major faults. */
    const char *name = "pf-major-data.bin";
    int fd = open(name, O_RDWR | O_CREAT | O_TRUNC, 0600);
    if (fd < 0) {
        perror("open");
        return 1;
    }
    char block[PAGE];
    memset(block, 'x', sizeof block);
    for (long i = 0; i < PAGES; i++) {
        if (write(fd, block, sizeof block) != (ssize_t) sizeof block) {
            perror("write");
            return 1;
        }
    }
    fsync(fd); /* make the pages clean, so the kernel may drop them */

    read_mapped(fd, MADV_NORMAL, "normal (the kernel reads ahead):");
    read_mapped(fd, MADV_RANDOM, "MADV_RANDOM (no read-ahead):");

    close(fd);
    unlink(name);
    return 0;
}
