#include <stdio.h>

int main(void) {
    FILE *f = fopen("settings.conf", "r");
    if (f == NULL) {
        perror("settings.conf"); /* says why, using the error the kernel returned */
        return 1;
    }
    char line[100];
    while (fgets(line, sizeof line, f) != NULL) {
        fputs(line, stdout);
    }
    fclose(f);
    return 0;
}
