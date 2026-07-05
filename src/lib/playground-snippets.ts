export interface Snippet {
  id: string;
  emoji: string;
  label: string;
  code: string;
  output: string;
}

export const SNIPPETS: Snippet[] = [
  {
    id: "hello",
    emoji: "👋",
    label: "Hello, world",
    code: `#include <stdio.h>

int main(void) {
    printf("Hello, world!\\n");
    return 0;
}
`,
    output: "Hello, world!",
  },
  {
    id: "linked-list",
    emoji: "🔗",
    label: "Singly linked list",
    code: `#include <stdio.h>

struct node { int val; struct node *next; };

int main(void) {
    struct node c = { 3, NULL };
    struct node b = { 2, &c };
    struct node a = { 1, &b };
    for (struct node *n = &a; n; n = n->next) {
        printf("%d ", n->val);
    }
    printf("\\n");
    return 0;
}
`,
    output: "1 2 3 ",
  },
  {
    id: "bitwise",
    emoji: "🧮",
    label: "Bit-flag toggler",
    code: `#include <stdio.h>

int main(void) {
  unsigned char flags = 0b0000;
  flags |= (1 << 2); // set bit 2
  printf("flags = %d\\n", flags);
  return 0;
}
`,
    output: "flags = 4",
  },
  {
    id: "string-reverse",
    emoji: "🧵",
    label: "String reverse (in place)",
    code: `#include <stdio.h>
#include <string.h>

void reverse(char *s) {
    int i = 0, j = strlen(s) - 1;
    while (i < j) {
        char t = s[i]; s[i] = s[j]; s[j] = t;
        i++; j--;
    }
}

int main(void) {
    char s[] = "ascend";
    reverse(s);
    printf("%s\\n", s);
    return 0;
}
`,
    output: "dnecsa",
  },
];

export const DEFAULT_FILES: Record<string, string> = {
  "main.c": SNIPPETS[2].code,
  "scratch.c": `#include <stdio.h>

int main(void) {
    // scratch away
    return 0;
}
`,
  "bitwise_test.c": SNIPPETS[2].code,
  "notes.md": `# Scratch notes

Anything you write here is just for you — it doesn't save
anywhere or count toward anything.
`,
};

export function findSnippetByCode(code: string): Snippet | null {
  const trimmed = code.trim();
  return SNIPPETS.find((s) => s.code.trim() === trimmed) ?? null;
}
