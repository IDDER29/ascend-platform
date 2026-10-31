#include <stdio.h>

int main(void) {
    for (int day = 1; day <= 7; day += 3) {
        switch (day) {
        case 6:
        case 7:
            printf("%d: weekend\n", day);
            break;
        case 1:
            printf("%d: Monday\n", day);
            break;
        default:
            printf("%d: a weekday\n", day);
            break;
        }
    }
    return 0;
}
