#include "threadpool.h"

#include <pthread.h>
#include <stdbool.h>
#include <stdlib.h>

typedef struct task {
    void (*fn)(void *);
    void *arg;
    struct task *next;
} task;

struct threadpool {
    pthread_mutex_t lock;     /* guards every field below it */
    pthread_cond_t has_work;  /* signalled when a task is queued, or on shutdown */
    pthread_cond_t all_done;  /* signalled when pending drops to 0 */
    task *head, *tail;        /* the queue: take from head, add at tail */
    int pending;              /* queued or running tasks */
    bool stopping;
    int workers;
    pthread_t *threads;
};

static void *worker(void *arg) {
    threadpool *p = arg;
    pthread_mutex_lock(&p->lock);
    for (;;) {
        /* A while, not an if: a wakeup only means "check again". */
        while (p->head == NULL && !p->stopping) {
            pthread_cond_wait(&p->has_work, &p->lock);
        }
        if (p->head == NULL) { /* stopping, and nothing left to do */
            break;
        }
        task *t = p->head;
        p->head = t->next;
        if (p->head == NULL) {
            p->tail = NULL;
        }
        pthread_mutex_unlock(&p->lock); /* run the task without holding the lock */
        t->fn(t->arg);
        free(t);
        pthread_mutex_lock(&p->lock);
        if (--p->pending == 0) {
            pthread_cond_broadcast(&p->all_done);
        }
    }
    pthread_mutex_unlock(&p->lock);
    return NULL;
}

threadpool *tp_new(int workers) {
    threadpool *p = calloc(1, sizeof *p);
    if (p == NULL) {
        return NULL;
    }
    p->threads = calloc((size_t) workers, sizeof *p->threads);
    if (p->threads == NULL) {
        free(p);
        return NULL;
    }
    pthread_mutex_init(&p->lock, NULL);
    pthread_cond_init(&p->has_work, NULL);
    pthread_cond_init(&p->all_done, NULL);
    for (int i = 0; i < workers; i++) {
        if (pthread_create(&p->threads[i], NULL, worker, p) != 0) {
            p->workers = i;
            tp_free(p);
            return NULL;
        }
    }
    p->workers = workers;
    return p;
}

int tp_submit(threadpool *p, void (*fn)(void *), void *arg) {
    task *t = malloc(sizeof *t);
    if (t == NULL) {
        return -1;
    }
    t->fn = fn;
    t->arg = arg;
    t->next = NULL;
    pthread_mutex_lock(&p->lock);
    if (p->tail != NULL) {
        p->tail->next = t;
    } else {
        p->head = t;
    }
    p->tail = t;
    p->pending++;
    pthread_cond_signal(&p->has_work);
    pthread_mutex_unlock(&p->lock);
    return 0;
}

void tp_wait(threadpool *p) {
    pthread_mutex_lock(&p->lock);
    while (p->pending > 0) {
        pthread_cond_wait(&p->all_done, &p->lock);
    }
    pthread_mutex_unlock(&p->lock);
}

void tp_free(threadpool *p) {
    tp_wait(p);
    pthread_mutex_lock(&p->lock);
    p->stopping = true;
    pthread_cond_broadcast(&p->has_work);
    pthread_mutex_unlock(&p->lock);
    for (int i = 0; i < p->workers; i++) {
        pthread_join(p->threads[i], NULL);
    }
    pthread_cond_destroy(&p->all_done);
    pthread_cond_destroy(&p->has_work);
    pthread_mutex_destroy(&p->lock);
    free(p->threads);
    free(p);
}
