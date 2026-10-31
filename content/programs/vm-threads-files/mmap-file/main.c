#define _DEFAULT_SOURCE
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>

static void show(const char *path, const char *when) {
    char buf[64] = {0};
    int fd = open(path, O_RDONLY);
    ssize_t n = read(fd, buf, sizeof buf - 1);
    close(fd);
    printf("%-34s %.*s", when, (int) n, buf);
}

/* Map the file and change its first byte through memory, with the given sharing flag. */
static void edit(const char *path, int flags, char c) {
    int fd = open(path, O_RDWR);
    struct stat st;
    fstat(fd, &st);
    char *p = mmap(NULL, (size_t) st.st_size, PROT_READ | PROT_WRITE, flags, fd, 0);
    close(fd); /* the mapping stays valid after the descriptor is closed */
    if (p == MAP_FAILED) {
        perror("mmap");
        return;
    }
    p[0] = c; /* an ordinary memory write: no write() call */
    printf("%-34s %.*s", flags == MAP_SHARED ? "memory (MAP_SHARED):" : "memory (MAP_PRIVATE):", (int) st.st_size, p);
    munmap(p, (size_t) st.st_size);
}

int main(void) {
    const char *path = "/tmp/ascend-mmap-demo.txt";
    int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0600);
    const char *text = "hello, file\n";
    if (fd < 0 || write(fd, text, strlen(text)) != (ssize_t) strlen(text)) {
        perror("setup");
        return 1;
    }
    close(fd);

    show(path, "the file at first:");
    edit(path, MAP_PRIVATE, 'J');
    show(path, "the file after MAP_PRIVATE write:");
    edit(path, MAP_SHARED, 'Y');
    show(path, "the file after MAP_SHARED write:");
    unlink(path);
    return 0;
}
