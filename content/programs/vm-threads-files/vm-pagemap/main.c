#define _POSIX_C_SOURCE 200809L
#include <fcntl.h>
#include <inttypes.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

/* Look up one virtual page in /proc/self/pagemap: 8 bytes per page.
   Bit 63 says whether the page is in RAM; bits 0-54 hold the physical frame
   number, which the kernel only reveals to privileged processes. */
static void lookup(int fd, const void *addr, const char *what) {
    long page = sysconf(_SC_PAGESIZE);
    uint64_t entry;
    off_t where = (off_t) ((uintptr_t) addr / (uintptr_t) page) * (off_t) sizeof entry;
    if (pread(fd, &entry, sizeof entry, where) != (ssize_t) sizeof entry) {
        perror("pread");
        exit(1);
    }
    printf("%-28s in RAM: %-3s   frame number shown: %" PRIu64 "\n", what, (entry >> 63) & 1 ? "yes" : "no",
           entry & ((UINT64_C(1) << 55) - 1));
}

int main(void) {
    int fd = open("/proc/self/pagemap", O_RDONLY);
    if (fd < 0) {
        perror("open");
        return 1;
    }
    long page = sysconf(_SC_PAGESIZE);
    char *buf = malloc(4 * (size_t) page);
    if (buf == NULL) {
        return 1;
    }
    /* Align to a page boundary inside the buffer. */
    char *p = (char *) (((uintptr_t) buf + (uintptr_t) page - 1) & ~((uintptr_t) page - 1));
    lookup(fd, p + page, "heap page, never touched:");
    p[page] = 1;
    lookup(fd, p + page, "same page, after a write:");
    free(buf);
    close(fd);
    return 0;
}
