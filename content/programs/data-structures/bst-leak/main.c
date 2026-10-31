#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key;
    struct Node *left, *right;
} Node;

static Node *insert(Node *t, int key) {
    if (t == NULL) {
        Node *n = malloc(sizeof *n);
        if (n == NULL) {
            exit(1);
        }
        n->key = key;
        n->left = n->right = NULL;
        return n;
    }
    if (key < t->key) {
        t->left = insert(t->left, key);
    } else if (key > t->key) {
        t->right = insert(t->right, key);
    }
    return t;
}

static void tree_free(Node *t) {
    if (t != NULL) {
        free(t);
    }
}

int main(void) {
    Node *t = NULL;
    int keys[] = {50, 30, 70, 20, 40};
    for (int i = 0; i < 5; i++) {
        t = insert(t, keys[i]);
    }
    printf("built a tree of 5 keys\n");
    fflush(stdout);
    tree_free(t);
    return 0;
}
