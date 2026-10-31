#ifndef MYMALLOC_H
#define MYMALLOC_H

#include <stddef.h>

/* A teaching allocator: malloc and free over one 1 MiB region from mmap. */
void *my_malloc(size_t size);   /* 16-byte aligned, or NULL when it doesn't fit */
void my_free(void *p);          /* NULL is ignored; a double free stops the program */
void *my_realloc(void *p, size_t size);
void my_heap_dump(void);        /* prints every block, in address order */
int my_heap_check(void);        /* 1 if every block is consistent, 0 if not */

#endif
