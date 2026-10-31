#include <stdio.h>
#include <stdlib.h>

/* A binary search tree of ints: smaller keys go left, larger go right. The tree owns its nodes. */
typedef struct Node {
    int key;
    struct Node *left, *right;
} Node;

/* Insert key (duplicates are ignored). Returns 0, or -1 if memory ran out. */
static int insert(Node **link, int key) {
    while (*link != NULL) {
        if (key == (*link)->key) {
            return 0;
        }
        link = key < (*link)->key ? &(*link)->left : &(*link)->right;
    }
    Node *n = malloc(sizeof *n);
    if (n == NULL) {
        return -1;
    }
    n->key = key;
    n->left = n->right = NULL;
    *link = n;
    return 0;
}

/* Search, counting the nodes compared. */
static int contains(const Node *t, int key, int *compares) {
    *compares = 0;
    while (t != NULL) {
        (*compares)++;
        if (key == t->key) {
            return 1;
        }
        t = key < t->key ? t->left : t->right;
    }
    return 0;
}

static int height(const Node *t) {
    if (t == NULL) {
        return 0;
    }
    int l = height(t->left), r = height(t->right);
    return 1 + (l > r ? l : r);
}

static void print_in_order(const Node *t) {
    if (t != NULL) {
        print_in_order(t->left);
        printf("%d ", t->key);
        print_in_order(t->right);
    }
}

/* Free children before the node itself (post-order). */
static void tree_free(Node *t) {
    if (t != NULL) {
        tree_free(t->left);
        tree_free(t->right);
        free(t);
    }
}

int main(void) {
    Node *small = NULL;
    int keys[] = {50, 30, 70, 20, 40, 60, 80};
    for (int i = 0; i < 7; i++) {
        insert(&small, keys[i]);
    }
    print_in_order(small);
    printf("\nheight %d\n", height(small));
    tree_free(small);

    /* 1023 keys in a shuffled order, then the same keys in sorted order. */
    enum { N = 1023 };
    static int order[N];
    for (int i = 0; i < N; i++) {
        order[i] = i;
    }
    unsigned seed = 12345;
    for (int i = N - 1; i > 0; i--) { /* Fisher-Yates with a fixed, simple generator */
        seed = seed * 1103515245u + 12345u;
        int j = (int) ((seed >> 16) % (unsigned) (i + 1));
        int tmp = order[i];
        order[i] = order[j];
        order[j] = tmp;
    }
    Node *shuffled = NULL, *sorted = NULL;
    for (int i = 0; i < N; i++) {
        if (insert(&shuffled, order[i]) != 0 || insert(&sorted, i) != 0) {
            return 1;
        }
    }
    int c1, c2;
    contains(shuffled, N - 1, &c1);
    contains(sorted, N - 1, &c2);
    printf("shuffled inserts: height %d, finding %d took %d compares\n", height(shuffled), N - 1, c1);
    printf("sorted inserts:   height %d, finding %d took %d compares\n", height(sorted), N - 1, c2);
    tree_free(shuffled);
    tree_free(sorted);
    return 0;
}
