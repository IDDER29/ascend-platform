#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("A ");                /* into stdio's buffer */
    if (write(1, "B ", 2) != 2) { /* straight to the kernel */
        return 1;
    }
    printf("C\n");               /* into the buffer too */
    return 0;                    /* exit flushes the buffer: "A C" goes out now */
}
