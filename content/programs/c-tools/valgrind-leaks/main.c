#include <stdlib.h>
#include <string.h>

typedef struct node {
    int value;
    struct node *next;
} node;

static char *config; /* still pointed to at exit */
static char *middle; /* points into the middle of a block */

int main(void) {
    config = malloc(64);
    strcpy(config, "verbose=1");

    char *name = malloc(16); /* the only pointer is overwritten */
    strcpy(name, "Ada");
    name = NULL;

    node *list = malloc(sizeof *list); /* a list whose head is lost */
    list->value = 1;
    list->next = malloc(sizeof *list->next);
    list->next->value = 2;
    list->next->next = NULL;
    list = NULL;

    char *buffer = malloc(32); /* only a pointer to its middle is kept */
    middle = buffer + 8;

    return 0;
}
