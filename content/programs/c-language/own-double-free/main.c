#include <stdio.h>
#include <stdlib.h>

void finish(int *data) {
    printf("finishing with %d\n", data[0]);
    free(data); /* finish thinks it owns data */
}

int main(void) {
    int *data = malloc(4 * sizeof *data);
    if (data == NULL) {
        return 1;
    }
    data[0] = 42;
    finish(data);
    free(data); /* main thinks it owns data too */
    return 0;
}
