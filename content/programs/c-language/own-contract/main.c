#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Returns a new string "Hello, <name>!".
   The caller owns the result and must free it. */
char *make_greeting(const char *name) {
    size_t len = strlen("Hello, !") + strlen(name) + 1;
    char *s = malloc(len);
    if (s == NULL) {
        return NULL;
    }
    snprintf(s, len, "Hello, %s!", name);
    return s;
}

/* Borrows s: reads it, never frees it. */
void shout(const char *s) {
    printf("%s (%zu chars)\n", s, strlen(s));
}

int main(void) {
    char *g = make_greeting("Ada");
    if (g == NULL) {
        return 1;
    }
    shout(g);
    shout(g);
    free(g); /* main got ownership from make_greeting, so main frees */
    return 0;
}
