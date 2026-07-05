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
];
