#define _DEFAULT_SOURCE
#include <fcntl.h>
#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>

int main(void) {
    const char *path = "/tmp/ascend-scratch.txt";
    int fd = open(path, O_RDWR | O_CREAT | O_TRUNC, 0600);
    if (fd < 0) {
        perror("open");
        return 1;
    }
    unlink(path); /* the name is gone at once... */
    printf("name still there: %s\n", access(path, F_OK) == 0 ? "yes" : "no");

    if (write(fd, "still here\n", 11) != 11) { /* ...but the inode lives while it's open */
        perror("write");
        return 1;
    }
    struct stat st;
    fstat(fd, &st);
    printf("link count %ld, size %ld bytes\n", (long) st.st_nlink, (long) st.st_size);

    char buf[16] = {0};
    pread(fd, buf, sizeof buf - 1, 0);
    printf("read back: %s", buf);
    close(fd); /* the last reference: now the kernel frees the inode and its blocks */
    return 0;
}
