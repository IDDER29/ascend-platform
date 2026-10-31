#include <stdio.h>

int main(void) {
    int difficulty = 2;
    switch (difficulty) {
    case 1:
        printf("easy\n");
    case 2:
        printf("medium\n");
    case 3:
        printf("hard\n");
    default:
        printf("unknown\n");
    }
    return 0;
}
