#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    printf("hello, printed once\n");
    pid_t pid = fork();
    if (pid == 0) {
        return 0; /* the child exits at once */
    }
    waitpid(pid, NULL, 0);
    return 0;
}
