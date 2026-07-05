export interface PracticeQuestion {
  prompt: string;
  code?: string[];
  options: string[];
  correct: number;
  hint: string;
  reviewLabel: string;
}

export const POINTERS_DRILL: PracticeQuestion[] = [
  {
    prompt: "What does `&x` give you?",
    code: ["int x = 42;", "printf(\"%p\", &x);"],
    options: [
      "The value 42",
      "The memory address where x lives",
      "A copy of x",
      "A compile error — & isn't valid here",
    ],
    correct: 1,
    hint: "The & operator is the \"address-of\" operator — it never touches the value itself.",
    reviewLabel: "What does &x give you?",
  },
  {
    prompt: "Which line correctly declares a pointer to an int?",
    options: ["int p;", "int *p;", "ptr int p;", "int p[];"],
    correct: 1,
    hint: "The asterisk in a declaration marks the variable as a pointer, not a dereference.",
    reviewLabel: "Declaring a pointer to int",
  },
  {
    prompt: "What does this program print?",
    code: ["int  x = 42;", "int *p = &x;", "printf(\"%d\", *p);"],
    options: [
      "It prints the address stored in p",
      "It prints the value at the address p points to",
      "It prints the address of the pointer p itself",
      "It causes a compile error",
    ],
    correct: 1,
    hint: "* in an expression (not a declaration) means \"follow the address and read what's there.\"",
    reviewLabel: "What does this program print?",
  },
  {
    prompt: "An `int arr[5]` array sits at address 0x1000. What is `&arr[2]`, assuming a 4-byte int?",
    options: ["0x1000", "0x1002", "0x1008", "0x1014"],
    correct: 2,
    hint: "Each step moves by sizeof(int) bytes, not by 1 byte — index 2 is two full ints past the start.",
    reviewLabel: "Pointer arithmetic across array bounds",
  },
  {
    prompt: "After `*p = 7;`, why does the original variable x change too?",
    options: [
      "It doesn't — p and x are independent",
      "Because p holds x's address, so writing through p writes that same memory",
      "Because C automatically copies p's value back into x",
      "Only if x was declared with the volatile keyword",
    ],
    correct: 1,
    hint: "Dereferencing is a two-way street: p knows exactly where x lives in memory.",
    reviewLabel: "Why *p = 7 changes x too",
  },
  {
    prompt: "What is `p` in `int **p`?",
    options: [
      "A pointer to an int",
      "A pointer to a pointer to an int",
      "An array of two ints",
      "Invalid syntax in C",
    ],
    correct: 1,
    hint: "Each * adds one more level of indirection — two stars means two hops before you reach the int.",
    reviewLabel: "Double pointers, what ** means",
  },
  {
    prompt: "What's the risk of dereferencing an uninitialized pointer?",
    code: ["int *p;", "printf(\"%d\", *p);"],
    options: [
      "None — C zero-initializes all pointers automatically",
      "It reads/writes whatever garbage address p happens to hold — undefined behaviour",
      "It's a compile error, so it can never run",
      "It always crashes immediately and safely",
    ],
    correct: 1,
    hint: "A local pointer starts out pointing at whatever bytes were already sitting in that memory — could be anywhere.",
    reviewLabel: "Dereferencing an uninitialized pointer",
  },
  {
    prompt: "Why does `void swap(int *a, int *b)` work, but `void swap(int a, int b)` doesn't?",
    options: [
      "Pointers are just faster to pass than ints",
      "Passing by pointer lets the function write through to the caller's actual variables",
      "It doesn't matter — both versions work identically",
      "swap() is a reserved keyword and needs pointers",
    ],
    correct: 1,
    hint: "C always passes arguments by value — the only way to affect the caller's variables is to pass their addresses.",
    reviewLabel: "Why swap() needs pointer parameters",
  },
  {
    prompt: "After `int arr[5]; int *p = arr;`, what does `p` point to?",
    options: [
      "A copy of the whole array",
      "The address of arr[0] — arrays decay to a pointer to their first element",
      "Nothing — this is a type error",
      "The address of the array's length",
    ],
    correct: 1,
    hint: "In most expressions, an array name \"decays\" into a pointer to its first element.",
    reviewLabel: "Array-to-pointer decay",
  },
  {
    prompt: "What does `const int *p` mean?",
    options: [
      "p itself can't be changed, but *p can",
      "The int p points to can't be changed through p, but p can be reassigned",
      "Both p and *p are permanently fixed",
      "This is invalid syntax",
    ],
    correct: 1,
    hint: "Read it right-to-left from p: p is a pointer to a const int — the data is read-only through this pointer.",
    reviewLabel: "const int *p vs int *const p",
  },
];
