#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[]) {
    /* argv[0] is the path the program was started with; show only its last part. */
    const char *slash = strrchr(argv[0], '/');
    printf("argc = %d, program name = %s\n", argc, slash ? slash + 1 : argv[0]);
    for (int i = 1; i < argc; i++) {
        printf("argv[%d] = [%s]\n", i, argv[i]);
    }
    printf("argv[%d] is %s\n", argc, argv[argc] == NULL ? "NULL" : "not NULL");
    return 0;
}
