#include <assert.h>
#include <stdio.h>
#include "strutil.h"

int main(void) {
    assert(count_char("banana", 'a') == 3);
    assert(count_char("", 'a') == 0);
    assert(is_palindrome("level"));
    assert(is_palindrome("abca")); /* a wrong expectation: abca is not a palindrome */
    assert(is_palindrome(""));
    printf("all tests passed\n");
    return 0;
}
