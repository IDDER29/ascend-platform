#include <stdio.h>

int main(void) {
    unsigned char x = 200, y = 100;
    int sum = x + y;           /* both promoted to int first */
    unsigned char small = x + y;
    printf("int sum: %d\n", sum);
    printf("unsigned char sum: %d\n", small);
    printf("sizeof(x + y) = %zu\n", sizeof(x + y));
    char c = (char) 200;
    printf("char 200 reads back as %d\n", c);
    return 0;
}
