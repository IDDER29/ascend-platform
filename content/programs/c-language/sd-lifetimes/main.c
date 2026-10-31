#include <stdio.h>
#include <stdlib.h>

int calls(void) {
    static int count = 0;    /* static: one object for the whole run */
    count++;
    return count;
}

int *make_array(int n) {
    int *a = malloc(n * sizeof *a);   /* allocated: lives until free */
    if (a == NULL) {
        return NULL;
    }
    for (int i = 0; i < n; i++) {
        a[i] = i * i;                 /* i is automatic: gone after the loop */
    }
    return a;
}

int main(void) {
    calls();
    calls();
    printf("calls() has run %d times\n", calls());

    int *squares = make_array(5);
    if (squares == NULL) {
        return 1;
    }
    printf("squares[4] = %d, still alive after make_array returned\n", squares[4]);
    free(squares);                    /* its lifetime ends here */
    return 0;
}
