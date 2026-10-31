#include <pthread.h>
#include <stdio.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

#define N 2000

static void *nothing(void *arg) {
    return arg;
}

static double seconds(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &t);
    return t.tv_sec + t.tv_nsec / 1e9;
}

int main(void) {
    double start = seconds();
    for (int i = 0; i < N; i++) {
        pid_t pid = fork();
        if (pid == 0) {
            _exit(0);
        }
        waitpid(pid, NULL, 0);
    }
    double processes = seconds() - start;

    start = seconds();
    for (int i = 0; i < N; i++) {
        pthread_t t;
        pthread_create(&t, NULL, nothing, NULL);
        pthread_join(t, NULL);
    }
    double threads = seconds() - start;

    printf("%d processes: %.1f microseconds each\n", N, processes / N * 1e6);
    printf("%d threads:   %.1f microseconds each\n", N, threads / N * 1e6);
    return 0;
}
