#include <stdio.h>

int main(void) {
    int n = 42;
    double price = 3.14159;
    char grade = 'B';

    printf("[%d] [%5d] [%-5d] [%05d]\n", n, n, n, n);
    printf("[%x] [%X] [%o]\n", 255, 255, 8);
    printf("[%f] [%.2f] [%8.3f] [%e]\n", price, price, price, price);
    printf("[%c] [%d]\n", grade, grade);
    printf("[%s] [%10s] [%-10s]\n", "hi", "hi", "hi");
    printf("[%zu] [%%]\n", sizeof(int));
    return 0;
}
