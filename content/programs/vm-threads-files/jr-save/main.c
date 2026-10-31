#define _DEFAULT_SOURCE
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>
#include <unistd.h>

#define CONFIG "/tmp/ascend-config.txt"
#define TEMP "/tmp/ascend-config.txt.tmp"

static void write_all(int fd, const char *text) {
    if (write(fd, text, strlen(text)) != (ssize_t) strlen(text)) {
        perror("write");
        exit(1);
    }
}

static void show(const char *when) {
    char buf[64] = {0};
    int fd = open(CONFIG, O_RDONLY);
    ssize_t n = fd < 0 ? -1 : read(fd, buf, sizeof buf - 1);
    if (fd >= 0) {
        close(fd);
    }
    printf("%-36s \"%.*s\"\n", when, n > 0 ? (int) n - 1 : 0, buf);
}

static void reset(void) {
    int fd = open(CONFIG, O_WRONLY | O_CREAT | O_TRUNC, 0600);
    write_all(fd, "volume=7\n");
    close(fd);
}

/* Overwrite the file in place. The program "crashes" between truncating and writing. */
static void unsafe_save(int crash) {
    int fd = open(CONFIG, O_WRONLY | O_TRUNC);
    if (crash) {
        _exit(1);
    }
    write_all(fd, "volume=9\n");
    close(fd);
}

/* Write a new file, make it durable, then swap it in with one atomic rename. */
static void safe_save(int crash) {
    int fd = open(TEMP, O_WRONLY | O_CREAT | O_TRUNC, 0600);
    write_all(fd, "volume=9\n");
    fsync(fd); /* the new contents reach the disk before they get the real name */
    close(fd);
    if (crash) {
        _exit(1);
    }
    rename(TEMP, CONFIG); /* atomic: the name points at the old file or the new one, never half */
    int dir = open("/tmp", O_RDONLY);
    fsync(dir); /* make the rename itself durable */
    close(dir);
}

/* Run a save in a child process that may crash, as a stand-in for a crash or power cut. */
static void attempt(void (*save)(int), int crash) {
    pid_t pid = fork();
    if (pid == 0) {
        save(crash);
        _exit(0);
    }
    waitpid(pid, NULL, 0);
}

int main(void) {
    reset();
    show("before:");
    attempt(unsafe_save, 1);
    show("unsafe save, crash mid-way:");

    reset();
    attempt(safe_save, 1);
    show("safe save, crash before rename:");
    attempt(safe_save, 0);
    show("safe save, finished:");
    unlink(CONFIG);
    unlink(TEMP);
    return 0;
}
