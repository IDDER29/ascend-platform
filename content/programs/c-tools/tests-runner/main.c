#include <stdio.h>
#include "strutil.h"

/* A tiny test runner: CHECK records a failure and carries on, so one run reports them all. */
static int checks = 0, failures = 0;

#define CHECK(cond)                                                      \
    do {                                                                 \
        checks++;                                                        \
        if (!(cond)) {                                                   \
            failures++;                                                  \
            printf("FAIL %s:%d: %s\n", __FILE__, __LINE__, #cond);       \
        }                                                                \
    } while (0)

static void test_count_char(void) {
    CHECK(count_char("banana", 'a') == 3);
    CHECK(count_char("banana", 'z') == 0);
    CHECK(count_char("", 'a') == 0);
}

static void test_is_palindrome(void) {
    CHECK(is_palindrome("level"));
    CHECK(is_palindrome("abba"));
    CHECK(!is_palindrome("abca"));
    CHECK(is_palindrome(""));
    CHECK(is_palindrome("Level")); /* should case be ignored? the function says no */
}

int main(void) {
    test_count_char();
    test_is_palindrome();
    printf("%d checks, %d failed\n", checks, failures);
    return failures == 0 ? 0 : 1;
}
