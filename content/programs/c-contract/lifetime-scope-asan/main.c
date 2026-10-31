#include <stdio.h>

int main(void) {
    int *p;
    {
        int count = 7;
        p = &count;
    }
    /* count's lifetime ended at the closing brace above. */
    printf("%d\n", *p);
    return 0;
}
