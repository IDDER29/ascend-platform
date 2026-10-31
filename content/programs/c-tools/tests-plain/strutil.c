#include "strutil.h"

#include <string.h>

void reversed(const char *s, char *out) {
    size_t len = strlen(s);
    for (size_t i = 0; i <= len; i++) { /* one step too far: reads s[-1] when i == len */
        out[i] = s[len - 1 - i];
    }
    out[len] = '\0';
}
