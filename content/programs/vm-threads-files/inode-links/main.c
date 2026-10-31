#define _DEFAULT_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

static void cat(const char *path) {
    char buf[32] = {0};
    int fd = open(path, O_RDONLY);
    if (fd < 0) {
        printf("  read %-24s failed: %s\n", path, strerror(errno));
        return;
    }
    ssize_t n = read(fd, buf, sizeof buf - 1);
    close(fd);
    printf("  read %-24s \"%.*s\"\n", path, (int) (n > 0 ? n - 1 : 0), buf);
}

int main(void) {
    const char *a = "/tmp/ascend-a.txt", *b = "/tmp/ascend-b.txt", *c = "/tmp/ascend-c.txt";
    unlink(a);
    unlink(b);
    unlink(c);
    int fd = open(a, O_WRONLY | O_CREAT, 0644);
    if (fd < 0 || write(fd, "hello\n", 6) != 6) {
        perror("setup");
        return 1;
    }
    close(fd);

    link(a, b);    /* a second name for the same inode */
    symlink(a, c); /* a new inode whose content is the path "/tmp/ascend-a.txt" */

    struct stat sa, sb, sc, lc;
    stat(a, &sa);
    stat(b, &sb);
    stat(c, &sc);  /* stat follows the symbolic link... */
    lstat(c, &lc); /* ...lstat looks at the link itself */
    printf("a and b share an inode: %s, link count %ld\n", sa.st_ino == sb.st_ino ? "yes" : "no", (long) sa.st_nlink);
    printf("stat(c) reaches a's inode: %s\n", sc.st_ino == sa.st_ino ? "yes" : "no");
    printf("lstat(c) is its own inode: %s, a symbolic link: %s, %ld bytes long\n",
           lc.st_ino != sa.st_ino ? "yes" : "no", S_ISLNK(lc.st_mode) ? "yes" : "no", (long) lc.st_size);

    unlink(a); /* remove the name "a" */
    stat(b, &sb);
    printf("after unlink(a), b's link count is %ld\n", (long) sb.st_nlink);
    cat(b);
    cat(c);
    unlink(b);
    unlink(c);
    return 0;
}
