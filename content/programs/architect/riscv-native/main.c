/* Runs on the core and natively: print() writes to the core's output address, or to stdout. */
#ifdef __riscv
static void print(int v) { *(volatile int *)0xFFF0 = v; }
#else
#include <stdio.h>
static void print(int v) { printf("out: %d\n", v); }
#endif

static int fib(int n) {
    return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

static int primes_below(int limit) {
    int count = 0;
    for (int n = 2; n < limit; n++) {
        int prime = 1;
        for (int d = 2; d * d <= n; d++) {
            int r = n;
            while (r >= d) r -= d;  /* r = n % d, without the M extension's remainder */
            if (r == 0) { prime = 0; break; }
        }
        count += prime;
    }
    return count;
}

/* Global, so the compiler can't work the answers out ahead of time: the core has to. */
int data[8] = {5, -3, 12, 0, -7, 9, 2, 4};

int main(void) {
    int sum = 0;
    for (int i = 1; i <= 100; i++) sum += i;
    print(sum);                 /* 5050 */
    print(fib(15));             /* 610 */
    print(primes_below(200));   /* 46 */
    int max = data[0], neg = 0, neg_total = 0;
    for (int i = 0; i < 8; i++) {
        if (data[i] > max) max = data[i];
        if (data[i] < 0) {
            neg++;
            neg_total += data[i];
        }
    }
    print(max);                 /* 12 */
    print(neg);                 /* 2 */
    print(neg_total >> 2);      /* -10 >> 2 = -3: an arithmetic shift keeps the sign */
    return 0;
}
