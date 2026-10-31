#include <stdio.h>
#include <stdlib.h>

/* A stack of chars on a growing array. The stack owns `items`; stack_free releases it. */
typedef struct {
    char *items;
    size_t len, cap;
} Stack;

static int push(Stack *s, char c) {
    if (s->len == s->cap) {
        size_t new_cap = s->cap ? s->cap * 2 : 8;
        char *bigger = realloc(s->items, new_cap);
        if (bigger == NULL) {
            return -1;
        }
        s->items = bigger;
        s->cap = new_cap;
    }
    s->items[s->len++] = c;
    return 0;
}

/* Pop into *out. Returns 0, or -1 if the stack is empty (never reads past the bottom). */
static int pop(Stack *s, char *out) {
    if (s->len == 0) {
        return -1;
    }
    *out = s->items[--s->len];
    return 0;
}

static void stack_free(Stack *s) {
    free(s->items);
    s->items = NULL;
    s->len = s->cap = 0;
}

/* 1 if every bracket in line is closed by the matching kind, in the right order. */
static int balanced(const char *line) {
    Stack s = {0};
    int ok = 1;
    for (const char *p = line; *p != '\0' && ok; p++) {
        if (*p == '(' || *p == '[' || *p == '{') {
            if (push(&s, *p) != 0) {
                ok = 0;
            }
        } else if (*p == ')' || *p == ']' || *p == '}') {
            char open;
            char want = *p == ')' ? '(' : *p == ']' ? '[' : '{';
            if (pop(&s, &open) != 0 || open != want) {
                ok = 0;
            }
        }
    }
    if (s.len != 0) {
        ok = 0; /* something was opened and never closed */
    }
    stack_free(&s);
    return ok;
}

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        for (char *p = line; *p != '\0'; p++) {
            if (*p == '\n') {
                *p = '\0';
            }
        }
        printf("%-24s %s\n", line, balanced(line) ? "balanced" : "NOT balanced");
    }
    return 0;
}
