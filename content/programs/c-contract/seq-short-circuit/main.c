#include <stdio.h>

static int check(int n) {
    printf("check(%d) ", n);
    return n > 1;
}

int main(void) {
    int count = 0;
    int ok = check(1) && check(2); /* left first; right only if needed */
    printf("-> %d\n", ok);

    ok = check(3) || check(4);
    printf("-> %d\n", ok);

    int x = (count++, count * 10); /* comma: left side finished first */
    printf("count = %d, x = %d\n", count, x);
    return 0;
}
