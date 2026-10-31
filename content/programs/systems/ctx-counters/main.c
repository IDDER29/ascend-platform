#define _DEFAULT_SOURCE
#include <stdio.h>
#include <string.h>
#include <unistd.h>

/* Read one "name: value" line from /proc/self/status. */
static long status_value(const char *name) {
    FILE *f = fopen("/proc/self/status", "r");
    if (f == NULL) {
        return -1;
    }
    char line[256];
    long value = -1;
    size_t len = strlen(name);
    while (fgets(line, sizeof line, f) != NULL) {
        if (strncmp(line, name, len) == 0 && line[len] == ':') {
            sscanf(line + len + 1, "%ld", &value);
        }
    }
    fclose(f);
    return value;
}

int main(void) {
    long before = status_value("voluntary_ctxt_switches");
    for (int i = 0; i < 50; i++) {
        usleep(1000); /* wait 1 ms: nothing to do, so give the CPU away */
    }
    long after = status_value("voluntary_ctxt_switches");
    printf("50 sleeps added at least 50 voluntary switches: %s\n", after - before >= 50 ? "yes" : "no");
    return 0;
}
