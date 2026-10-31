#define _GNU_SOURCE
#include <errno.h>
#include <signal.h>
#include <stdio.h>
#include <string.h>
#include <sys/uio.h>
#include <sys/wait.h>
#include <unistd.h>

static char secret[32] = "nothing yet";

/* Ask the kernel to copy len bytes at addr in process pid into buf. */
static void peek(const char *label, pid_t pid, void *addr, size_t len) {
    char buf[32] = {0};
    struct iovec local = {buf, len};
    struct iovec remote = {addr, len};
    ssize_t n = process_vm_readv(pid, &local, 1, &remote, 1, 0);
    if (n == -1) {
        printf("%s: %s\n", label, strerror(errno));
    } else {
        printf("%s: read \"%s\"\n", label, buf);
    }
}

int main(void) {
    int ready[2];
    if (pipe(ready) == -1) {
        return 1;
    }
    pid_t child = fork();
    if (child == 0) {
        strcpy(secret, "the child's secret"); /* only the child's copy changes */
        if (write(ready[1], "x", 1) != 1) {
            return 1;
        }
        pause(); /* wait to be killed */
        return 0;
    }
    char c;
    if (read(ready[0], &c, 1) != 1) {
        return 1;
    }
    printf("parent's own secret: \"%s\"\n", secret);
    peek("parent reads its child's secret", child, secret, sizeof secret);
    peek("parent reads process 1 at the same address", 1, secret, sizeof secret);
    kill(child, SIGKILL);
    waitpid(child, NULL, 0);
    return 0;
}
