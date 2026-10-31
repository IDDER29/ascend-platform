#include <stdio.h>

void show(int a[10]) {
    printf("inside show: sizeof a = %zu\n", sizeof a);
}

int main(void) {
    int arr[10] = {0};
    int *p = arr;
    printf("sizeof arr = %zu\n", sizeof arr);
    printf("sizeof p   = %zu\n", sizeof p);
    printf("elements:    %zu\n", sizeof arr / sizeof arr[0]);
    show(arr);
    return 0;
}
