#include <stdio.h>

int main(void) {
    int values[] = {0, 1, -1, 42};
    for (int i = 0; i < 4; i++) {
        if (values[i]) {
            printf("%d is true\n", values[i]);
        } else {
            printf("%d is false\n", values[i]);
        }
    }
    return 0;
}
