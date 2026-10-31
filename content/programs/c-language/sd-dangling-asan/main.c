#include <stdio.h>

int *keep;

void make_answer(void) {
    int answer = 42;
    keep = &answer;   /* stored where it outlives answer */
}

int main(void) {
    make_answer();
    printf("%d\n", *keep);
    return 0;
}
