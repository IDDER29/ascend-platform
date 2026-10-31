#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "hi";
    printf("sizeof s = %zu, strlen(s) = %zu\n", sizeof s, strlen(s));
    for (size_t i = 0; i < sizeof s; i++) {
        printf("s[%zu] = %d\n", i, s[i]);
    }
    s[1] = '\0';
    printf("after s[1] = 0: \"%s\", strlen = %zu\n", s, strlen(s));
    return 0;
}
