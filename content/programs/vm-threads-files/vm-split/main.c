#include <inttypes.h>
#include <stdio.h>
#include <stdlib.h>

/* Split a 48-bit x86-64 virtual address the way the page-table walk uses it:
   four 9-bit indices (one per table) and a 12-bit offset inside a 4 KiB page. */
static void split(uint64_t va) {
    unsigned pml4 = (va >> 39) & 0x1ff;
    unsigned pdpt = (va >> 30) & 0x1ff;
    unsigned pd = (va >> 21) & 0x1ff;
    unsigned pt = (va >> 12) & 0x1ff;
    unsigned offset = va & 0xfff;
    printf("0x%012" PRIx64 "  ->  PML4 %3u  PDPT %3u  PD %3u  PT %3u  offset 0x%03x\n",
           va, pml4, pdpt, pd, pt, offset);
}

int main(int argc, char *argv[]) {
    for (int i = 1; i < argc; i++) {
        split(strtoull(argv[i], NULL, 16));
    }
    return 0;
}
