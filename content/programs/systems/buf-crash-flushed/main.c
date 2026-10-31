#include <stdio.h>

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0); /* line buffering: send each line as it ends */
    printf("step 1 done\n");
    printf("step 2 done\n");
    int *p = NULL;
    *p = 42; /* crash: a write through a null pointer */
    printf("step 3 done\n");
    return 0;
}
