#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define MAX_TRIES 7

/* Read one line and turn it into a number from 1 to 100.
   Returns 1 if it worked, 0 if the line isn't such a number, -1 when the input has run out. */
static int read_guess(int *guess) {
    char line[64];
    if (fgets(line, sizeof line, stdin) == NULL) {
        return -1;
    }
    char extra;
    if (sscanf(line, "%d %c", guess, &extra) != 1) {
        return 0;
    }
    return *guess >= 1 && *guess <= 100;
}

int main(int argc, char *argv[]) {
    /* A seed on the command line makes a game repeatable, for testing. */
    unsigned seed = argc > 1 ? (unsigned) atoi(argv[1]) : (unsigned) time(NULL);
    srand(seed);
    int secret = rand() % 100 + 1;

    printf("I'm thinking of a number from 1 to 100. You have %d tries.\n", MAX_TRIES);
    int tries = 0;
    while (tries < MAX_TRIES) {
        int guess;
        printf("Guess %d: ", tries + 1);
        int ok = read_guess(&guess);
        if (ok == -1) {
            printf("\nNo more input. The number was %d.\n", secret);
            return 1;
        }
        if (ok == 0) {
            printf("Please type a whole number from 1 to 100.\n");
            continue; /* a typo doesn't cost a try */
        }
        tries++;
        if (guess == secret) {
            printf("Yes! It was %d. You took %d %s.\n", secret, tries, tries == 1 ? "try" : "tries");
            return 0;
        }
        printf("%s\n", guess < secret ? "Too low." : "Too high.");
    }
    printf("Out of tries. The number was %d.\n", secret);
    return 0;
}
