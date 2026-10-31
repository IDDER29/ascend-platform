#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

static void show_mode(const char *path) {
    struct stat st;
    if (stat(path, &st) == 0) {
        printf("  mode is %04o\n", (unsigned) (st.st_mode & 07777));
    }
}

static void try_open(const char *label, const char *path) {
    int fd = open(path, O_RDONLY);
    if (fd == -1) {
        printf("  open %s for reading: %s\n", label, strerror(errno));
    } else {
        printf("  open %s for reading: ok\n", label);
        close(fd);
    }
}

int main(void) {
    char dir[] = "/tmp/perm-demo-XXXXXX";
    if (mkdtemp(dir) == NULL) {
        perror("mkdtemp");
        return 1;
    }
    char path[64];
    snprintf(path, sizeof path, "%s/notes.txt", dir);

    umask(022); /* never give write permission to group or others */
    printf("create with mode 0666, umask 022:\n");
    int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0666);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    close(fd);
    show_mode(path);

    printf("chmod 0000:\n");
    chmod(path, 0);
    show_mode(path);
    try_open("my own file", path);

    printf("chmod 0400:\n");
    chmod(path, 0400);
    show_mode(path);
    try_open("my own file", path);

    printf("someone else's file:\n");
    try_open("/etc/shadow", "/etc/shadow");

    unlink(path);
    rmdir(dir);
    return 0;
}
