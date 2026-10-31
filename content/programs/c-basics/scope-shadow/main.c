#include <stdio.h>

int count = 100;   /* file scope: visible to every function below */

void show(void) {
    printf("show sees count = %d\n", count);
}

int main(void) {
    printf("main sees count = %d\n", count);
    int count = 1;                       /* a new count, local to main */
    printf("main sees count = %d\n", count);
    {
        int count = 2;                   /* another one, local to this block */
        printf("block sees count = %d\n", count);
    }
    printf("main sees count = %d\n", count);
    show();
    return 0;
}
