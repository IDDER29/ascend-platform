#include <stdio.h>

int main(void) {
    int arr[10];
    int *first = arr;        /* decays: &arr[0], type int *        */
    int (*whole)[10] = &arr; /* no decay: the whole array, int (*)[10] */
    printf("same address? %s\n", (void *) first == (void *) whole ? "yes" : "no");
    printf("first + 1 moves %td bytes\n", (char *) (first + 1) - (char *) first);
    printf("whole + 1 moves %td bytes\n", (char *) (whole + 1) - (char *) whole);
    return 0;
}
