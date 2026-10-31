#include <limits.h>
#include <stdio.h>

int main(void) {
    unsigned int u = UINT_MAX;
    u = u + 1;                 /* unsigned arithmetic wraps: defined */
    printf("UINT_MAX + 1 = %u\n", u);
    printf("-7 / 2 = %d\n", -7 / 2);  /* truncates toward zero since C99 */
    printf("-7 %% 2 = %d\n", -7 % 2); /* sign follows the dividend */
    printf("7 / -2 = %d\n", 7 / -2);
    return 0;
}
