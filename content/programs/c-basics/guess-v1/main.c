#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    unsigned seed = argc > 1 ? (unsigned) atoi(argv[1]) : 1;
    srand(seed);
    int secret = rand() % 100 + 1;

    printf("I'm thinking of a number from 1 to 100.\n");
    int guess = 0;
    int tries = 0;
    while (guess != secret) {
        printf("Your guess: ");
        scanf("%d", &guess);
        tries++;
        if (guess < secret) {
            printf("Too low.\n");
        } else if (guess > secret) {
            printf("Too high.\n");
        }
    }
    printf("Yes! It was %d. You took %d tries.\n", secret, tries);
    return 0;
}
