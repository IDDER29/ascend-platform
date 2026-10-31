#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    setenv("GREETING", "hello from the parent", 1);
    fflush(stdout);

    pid_t pid = fork();
    if (pid == 0) {
        /* The child changes its own copy of the environment... */
        setenv("GREETING", "changed by the child", 1);
        /* ...and a program it runs inherits that copy. */
        execlp("printenv", "printenv", "GREETING", (char *) NULL);
        perror("execlp");
        exit(127);
    }
    waitpid(pid, NULL, 0);
    printf("parent still sees: %s\n", getenv("GREETING"));
    return 0;
}
