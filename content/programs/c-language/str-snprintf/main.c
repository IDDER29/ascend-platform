#include <stdio.h>

int main(void) {
    char buf[8];
    int needed = snprintf(buf, sizeof buf, "score=%d", 12345);
    printf("buf: \"%s\"\n", buf);
    printf("needed %d chars, buffer holds %zu\n", needed, sizeof buf - 1);
    if (needed >= (int) sizeof buf) {
        printf("truncated\n");
    }
    return 0;
}
