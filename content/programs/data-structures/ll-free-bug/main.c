#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

static Node *push_front(Node *head, int value) {
    Node *n = malloc(sizeof *n);
    if (n == NULL) {
        exit(1);
    }
    n->value = value;
    n->next = head;
    return n;
}

static void list_free(Node *head) {
    for (Node *n = head; n != NULL; n = n->next) {
        free(n);
    }
}

int main(void) {
    Node *list = NULL;
    for (int i = 1; i <= 3; i++) {
        list = push_front(list, i);
    }
    printf("built a list of 3\n");
    fflush(stdout);
    list_free(list);
    printf("freed it\n");
    return 0;
}
