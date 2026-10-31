#include "strutil.h"

#include <string.h>

int count_char(const char *s, char c) {
    int n = 0;
    for (; *s != '\0'; s++) {
        if (*s == c) {
            n++;
        }
    }
    return n;
}

int is_palindrome(const char *s) {
    size_t len = strlen(s);
    for (size_t i = 0; i < len / 2; i++) {
        if (s[i] != s[len - 1 - i]) {
            return 0;
        }
    }
    return 1;
}
