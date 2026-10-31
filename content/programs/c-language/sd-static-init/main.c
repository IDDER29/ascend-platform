#include <stdio.h>

int global_total;              /* static storage: starts at 0 */
static int tally[4];           /* every element starts at 0 */
static const char *name;       /* a null pointer */

int main(void) {
    static double ratio;       /* static, even inside a function: 0.0 */
    printf("%d %d %d %f %s\n", global_total, tally[0], tally[3], ratio, name == NULL ? "NULL" : name);
    return 0;
}
