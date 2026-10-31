#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>

/* Start a child that ends with `how`, then report what the parent's wait sees. */
static void run(const char *label, int how) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        if (how == -1) {
            abort(); /* killed by a signal, SIGABRT */
        }
        exit(how);
    }
    int status;
    waitpid(pid, &status, 0);
    if (WIFEXITED(status)) {
        printf("%-12s exited, status %d\n", label, WEXITSTATUS(status));
    } else if (WIFSIGNALED(status)) {
        printf("%-12s killed by signal %d\n", label, WTERMSIG(status));
    }
}

int main(void) {
    run("exit(0)", 0);
    run("exit(3)", 3);
    run("exit(255)", 255);
    run("exit(256)", 256);
    run("exit(300)", 300);
    run("abort()", -1);
    return 0;
}
