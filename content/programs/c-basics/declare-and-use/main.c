#include <stdio.h>

int main(void) {
    int apples = 7;
    double price = 0.45;
    char grade = 'B';

    apples = apples + 5;
    printf("%d apples at %.2f each: %.2f\n", apples, price, apples * price);
    printf("grade %c is stored as %d\n", grade, grade);
    return 0;
}
