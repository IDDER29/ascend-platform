#include <stdio.h>

int *make_answer(void) {
    int answer = 42;
    return &answer;   /* answer dies when make_answer returns */
}

int main(void) {
    int *p = make_answer();
    printf("%d\n", *p);
    return 0;
}
