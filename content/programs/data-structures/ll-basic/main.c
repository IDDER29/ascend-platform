#include <stdio.h>
#include <stdlib.h>

/* A singly linked list. The list owns its nodes: list_free frees every one. */
typedef struct Node {
    int value;
    struct Node *next;
} Node;

/* Add at the front: O(1). Returns 0, or -1 if memory ran out (the list is unchanged). */
static int push_front(Node **head, int value) {
    Node *n = malloc(sizeof *n);
    if (n == NULL) {
        return -1;
    }
    n->value = value;
    n->next = *head;
    *head = n;
    return 0;
}

/* Find a value, counting the nodes visited: O(n). */
static Node *find(Node *head, int value, int *visited) {
    *visited = 0;
    for (Node *n = head; n != NULL; n = n->next) {
        (*visited)++;
        if (n->value == value) {
            return n;
        }
    }
    return NULL;
}

/* Remove the first node holding value, if any. head is a pointer to the link that points at it. */
static void remove_value(Node **link, int value) {
    while (*link != NULL && (*link)->value != value) {
        link = &(*link)->next;
    }
    if (*link != NULL) {
        Node *dead = *link;
        *link = dead->next; /* unlink first, then free */
        free(dead);
    }
}

static void print_list(const Node *head) {
    for (const Node *n = head; n != NULL; n = n->next) {
        printf("%d -> ", n->value);
    }
    printf("NULL\n");
}

static void list_free(Node *head) {
    while (head != NULL) {
        Node *next = head->next; /* read next before the node is gone */
        free(head);
        head = next;
    }
}

int main(void) {
    Node *list = NULL;
    for (int i = 1; i <= 5; i++) {
        if (push_front(&list, i * 10) != 0) {
            list_free(list);
            return 1;
        }
    }
    print_list(list);

    int visited;
    find(list, 10, &visited);
    printf("finding 10: %d nodes visited\n", visited);
    find(list, 50, &visited);
    printf("finding 50: %d node visited\n", visited);

    remove_value(&list, 30);
    remove_value(&list, 50);
    print_list(list);

    list_free(list);
    return 0;
}
