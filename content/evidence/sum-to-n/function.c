/* Add up 1 + 2 + ... + n. */
unsigned sum_to(unsigned n) {
    unsigned total = 0;
    for (unsigned i = 1; i <= n; i++) {
        total += i;
    }
    return total;
}
