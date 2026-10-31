#include <stdio.h>
#include "mymalloc.h"

#define N 20000

int main(void) {
    static void *blocks[N];
    int n = 0;
    while (n < N && (blocks[n] = my_malloc(64)) != NULL) { /* fill the heap with 64-byte blocks */
        n++;
    }
    printf("allocated %d blocks of 64 bytes\n", n);
    for (int i = 0; i < n; i += 2) { /* free every other one */
        my_free(blocks[i]);
    }
    printf("freed %d of them: about %d KiB is free\n", (n + 1) / 2, (n + 1) / 2 * 80 / 1024);
    void *big = my_malloc(100);
    printf("my_malloc(100) %s\n", big != NULL ? "worked" : "returned NULL");
    return 0;
}
