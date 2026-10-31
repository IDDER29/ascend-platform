#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }
int divide(int a, int b) { return a / b; }

/* A dispatch table: each operator character paired with the function that does it. */
struct op {
    char symbol;
    int (*fn)(int, int);
};

static const struct op OPS[] = {
    { '+', add }, { '-', sub }, { '*', mul }, { '/', divide },
};

int main(void) {
    int a, b;
    char symbol;
    while (scanf("%d %c %d", &a, &symbol, &b) == 3) {
        int found = 0;
        for (size_t i = 0; i < sizeof OPS / sizeof OPS[0]; i++) {
            if (OPS[i].symbol == symbol) {
                if (symbol == '/' && b == 0) {
                    printf("%d / 0: can't divide by zero\n", a);
                } else {
                    printf("%d %c %d = %d\n", a, symbol, b, OPS[i].fn(a, b));
                }
                found = 1;
                break;
            }
        }
        if (!found) {
            printf("unknown operator '%c'\n", symbol);
        }
    }
    return 0;
}
