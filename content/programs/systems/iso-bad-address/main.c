#include <stdint.h>
#include <stdio.h>

int main(void) {
    int here = 7;
    printf("a variable I own: %d\n", here);
    fflush(stdout);
    /* An address nothing is mapped at in this process. */
    volatile int *elsewhere = (volatile int *) (uintptr_t) 0x10000;
    printf("now reading an address I don't own...\n");
    fflush(stdout);
    printf("%d\n", *elsewhere);
    return 0;
}
