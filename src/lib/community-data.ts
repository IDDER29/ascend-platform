export type ThreadCategory = "General discussion" | "Help & debugging" | "Show your project" | "Resources & links";

export interface CommunityThread {
  id: string;
  title: string;
  author: string;
  avatarGradient: string;
  category: ThreadCategory;
  when: string;
  replies: number;
  body: string;
  responses: { author: string; avatarGradient: string; when: string; body: string }[];
}

export const CATEGORIES: { name: ThreadCategory; icon: "message" | "help" | "ship" | "resource"; threadCount: number }[] = [
  { name: "General discussion", icon: "message", threadCount: 842 },
  { name: "Help & debugging", icon: "help", threadCount: 3104 },
  { name: "Show your project", icon: "ship", threadCount: 1266 },
  { name: "Resources & links", icon: "resource", threadCount: 610 },
];

export const THREADS: CommunityThread[] = [
  {
    id: "t1",
    title: "Why does my linked-list `free()` still segfault after I null the pointer?",
    author: "Rhea",
    avatarGradient: "from-[#7B4DFF] to-[#C13AE0]",
    category: "Help & debugging",
    when: "12 min ago",
    replies: 8,
    body: "I'm freeing each node in a loop but still get a segfault on the third free(). I set the pointer to NULL right after each free() — shouldn't that be safe?",
    responses: [
      {
        author: "Jonas",
        avatarGradient: "from-[#12B981] to-[#3BC6F0]",
        when: "9 min ago",
        body: "Nulling the pointer after free() only protects that one variable — if you already grabbed `next` before freeing, you're fine, but if you read `node->next` *after* freeing `node`, that's a use-after-free.",
      },
      {
        author: "Nadia",
        avatarGradient: "from-[#FF6B4A] to-[#FFB020]",
        when: "5 min ago",
        body: "Yep — save `next` in a temp var before you call free() on the current node. Classic off-by-one-step bug.",
      },
    ],
  },
  {
    id: "t2",
    title: "Shellforge passed! Sharing my approach to piping + redirection",
    author: "Jonas",
    avatarGradient: "from-[#12B981] to-[#3BC6F0]",
    category: "Show your project",
    when: "2 hours ago",
    replies: 14,
    body: "Finally got Shellforge passing all tests. The trick that unblocked me was building the pipe chain right-to-left so each stage already knows its downstream fd before forking.",
    responses: [
      {
        author: "Kenji",
        avatarGradient: "from-[#6D46F2] to-[#C13AE0]",
        when: "1 hour ago",
        body: "Nice work! Did you close unused fds in every child, or only the ones actively piping?",
      },
    ],
  },
  {
    id: "t3",
    title: "Best mental model for stack vs. heap? Diagrams that finally clicked",
    author: "Nadia",
    avatarGradient: "from-[#FF6B4A] to-[#FFB020]",
    category: "General discussion",
    when: "5 hours ago",
    replies: 21,
    body: "The lesson's diagram helped, but I still mix up which one grows which direction. Anyone have a trick that stuck?",
    responses: [
      {
        author: "Rhea",
        avatarGradient: "from-[#7B4DFF] to-[#C13AE0]",
        when: "4 hours ago",
        body: "'Stack grows down, heap grows up, and they race toward each other' is the one that stuck for me.",
      },
      {
        author: "Kenji",
        avatarGradient: "from-[#6D46F2] to-[#C13AE0]",
        when: "3 hours ago",
        body: "I print &x for a local and compare it to a malloc'd pointer in the same program — seeing the real addresses made it click instantly.",
      },
    ],
  },
  {
    id: "t4",
    title: "man 2 fork vs man 3 — which section for what, exactly?",
    author: "Kenji",
    avatarGradient: "from-[#6D46F2] to-[#C13AE0]",
    category: "Resources & links",
    when: "yesterday",
    replies: 6,
    body: "Still get confused about which man page section a given syscall vs library function lives in. Is there a clean rule of thumb?",
    responses: [
      {
        author: "Jonas",
        avatarGradient: "from-[#12B981] to-[#3BC6F0]",
        when: "yesterday",
        body: "Section 2 = actual syscalls (fork, open, read). Section 3 = C library functions (printf, malloc). `man 2 fork` and `man 3 printf` are the ones you'll use constantly.",
      },
    ],
  },
  {
    id: "t5",
    title: "Struct padding — does field order actually matter for size?",
    author: "Amine",
    avatarGradient: "from-[#7B4DFF] to-[#FF6B4A]",
    category: "General discussion",
    when: "2 days ago",
    replies: 0,
    body: "Reordering fields in a struct to go largest-to-smallest supposedly shrinks total size due to padding — anyone actually measured this with sizeof() on a real example?",
    responses: [],
  },
];
