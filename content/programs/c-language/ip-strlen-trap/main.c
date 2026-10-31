#include <stdio.h>
#include <string.h>

int main(void) {
    const char *name = "Al";
    if (strlen(name) - 5 > 0) {
        printf("longer than 5? strlen - 5 = %zu\n", strlen(name) - 5);
    }
    if (strlen(name) > 5) {
        printf("really longer than 5\n");
    } else {
        printf("not longer than 5\n");
    }
    return 0;
}
