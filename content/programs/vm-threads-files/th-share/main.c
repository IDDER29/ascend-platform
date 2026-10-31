#include <pthread.h>
#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int counter = 0; /* a global: one copy per process */

static void *add_one(void *arg) {
    (void) arg;
    counter++;
    return NULL;
}

int main(void) {
    /* A child process gets its own copy of the whole address space. */
    pid_t pid = fork();
    if (pid == 0) {
        counter++;
        printf("child process:  counter = %d\n", counter);
        return 0;
    }
    waitpid(pid, NULL, 0);
    printf("parent after the child: counter = %d\n", counter);

    /* A thread runs inside this process, in the same address space. */
    pthread_t t;
    pthread_create(&t, NULL, add_one, NULL);
    pthread_join(t, NULL);
    printf("parent after the thread: counter = %d\n", counter);
    return 0;
}
