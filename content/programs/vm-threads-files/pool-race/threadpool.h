#ifndef THREADPOOL_H
#define THREADPOOL_H

/* A fixed set of worker threads that run submitted tasks. The pool owns its
   threads and its queue; the caller owns each task's argument and must keep it
   alive until tp_wait has returned. */
typedef struct threadpool threadpool;

threadpool *tp_new(int workers);                          /* NULL on failure */
int tp_submit(threadpool *p, void (*fn)(void *), void *arg); /* 0 on success */
void tp_wait(threadpool *p);       /* returns when every submitted task has finished */
void tp_free(threadpool *p);       /* waits, stops the workers and frees the pool */

#endif
