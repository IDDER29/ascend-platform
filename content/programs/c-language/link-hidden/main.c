#include <stdio.h>

void log_message(const char *text);   /* declared here, defined in log.c? */

int main(void) {
    log_message("starting");
    return 0;
}
