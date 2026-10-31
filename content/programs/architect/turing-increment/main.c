/* A Turing machine that adds 1 to a binary number. The tape holds the number, the head starts on
   its rightmost digit, and a table of rules says what to do in each state for each symbol read. */
#include <stdio.h>
#include <string.h>

enum state { CARRY, DONE };

typedef struct {
    char write;   /* symbol to write */
    int move;     /* -1 left, +1 right, 0 stay */
    enum state next;
} rule;

/* The rule table, as a function of the state and the symbol read: '0', '1' or '_' (blank). */
static rule lookup(enum state s, char sym) {
    if (s == CARRY && sym == '1') return (rule){'0', -1, CARRY}; /* 1 + carry = 0, carry on left */
    if (s == CARRY && sym == '0') return (rule){'1', 0, DONE};   /* 0 + carry = 1, finished */
    return (rule){'1', 0, DONE};                                  /* blank: a new leading 1 */
}

static void run(const char *number) {
    char tape[32];
    memset(tape, '_', sizeof tape);
    size_t len = strlen(number);
    memcpy(tape + 8, number, len); /* blanks on both sides */
    int head = 8 + (int) len - 1;
    enum state s = CARRY;
    int steps = 0;
    while (s != DONE) {
        rule r = lookup(s, tape[head]);
        tape[head] = r.write;
        head += r.move;
        s = r.next;
        steps++;
    }
    tape[sizeof tape - 1] = '\0';
    printf("%-6s + 1 -> tape %s  (%d %s)\n", number, tape, steps, steps == 1 ? "step" : "steps");
}

int main(void) {
    run("1011");
    run("0");
    run("111");
    return 0;
}
