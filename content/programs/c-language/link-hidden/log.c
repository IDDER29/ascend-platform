#include <stdio.h>

static void log_message(const char *text) {
    printf("[log] %s\n", text);
}

void log_twice(const char *text) {
    log_message(text);
    log_message(text);
}
