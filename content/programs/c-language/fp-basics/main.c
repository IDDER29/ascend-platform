#include <stdio.h>

int twice(int x) { return 2 * x; }
int square(int x) { return x * x; }

/* A name for "pointer to a function taking an int and returning an int". */
typedef int (*IntOp)(int);

int apply(IntOp op, int value) {
    return op(value);
}

int main(void) {
    int (*f)(int) = twice;   /* the long way to declare one */
    printf("f(5) = %d\n", f(5));

    f = square;              /* the same variable, now aiming at square */
    printf("f(5) = %d\n", f(5));

    IntOp ops[] = { twice, square, twice };
    int x = 3;
    for (int i = 0; i < 3; i++) {
        x = apply(ops[i], x);
        printf("after step %d: %d\n", i + 1, x);
    }
    return 0;
}
