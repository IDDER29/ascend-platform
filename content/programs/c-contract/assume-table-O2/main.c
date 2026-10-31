#include <stdio.h>

int table[4] = {10, 20, 30, 40};

/* Is v in the table? The loop runs one step too far. */
int in_table(int v) {
    for (int i = 0; i <= 4; i++) {
        if (table[i] == v) {
            return 1;
        }
    }
    return 0;
}

int main(void) {
    int v;
    if (scanf("%d", &v) != 1) {
        return 1;
    }
    printf("in_table(%d) = %d\n", v, in_table(v));
    return 0;
}
