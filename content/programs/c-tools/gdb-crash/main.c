#include <ctype.h>
#include <stdio.h>
#include <string.h>

/* The name that starts with letter, or NULL if there isn't one. */
static const char *find(const char *names[], int n, char letter) {
    for (int i = 0; i < n; i++) {
        if (names[i][0] == letter) {
            return names[i];
        }
    }
    return NULL;
}

static void shout(const char *name) {
    size_t len = strlen(name);
    for (size_t i = 0; i < len; i++) {
        putchar(toupper((unsigned char) name[i]));
    }
    putchar('\n');
}

int main(void) {
    const char *names[] = {"ada", "grace", "linus"};
    shout(find(names, 3, 'g'));
    shout(find(names, 3, 'k'));
    return 0;
}
