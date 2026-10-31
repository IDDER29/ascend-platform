/* A five-stage pipeline timer. It reads the instructions a program actually ran (its dynamic trace),
   one per line, and works out the cycle each one enters each stage, with forwarding and branches
   predicted not taken (resolved in EX). */
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAX 64

typedef struct {
    char kind[8];  /* alu, load, store or branch */
    int dest;      /* register written, or 0 */
    int src1, src2;
    bool taken;    /* for a branch: was it taken? */
    char text[40];
} instr;

typedef struct {
    int IF, ID, EX, MEM, WB;
} times;

static int max(int a, int b) { return a > b ? a : b; }

int main(void) {
    instr prog[MAX];
    int n = 0;
    char taken[4];
    /* Each line: kind dest src1 src2 taken text, e.g. "load 1 2 0 - lw x1, 0(x2)" */
    while (n < MAX && scanf("%7s %d %d %d %3s %39[^\n]", prog[n].kind, &prog[n].dest, &prog[n].src1, &prog[n].src2, taken, prog[n].text) == 6) {
        prog[n].taken = strcmp(taken, "T") == 0;
        n++;
    }

    times t[MAX];
    int last_writer[32];
    for (int r = 0; r < 32; r++) {
        last_writer[r] = -1;
    }
    int next_if = 1, stalls = 0, flushes = 0;
    for (int i = 0; i < n; i++) {
        t[i].IF = next_if;
        t[i].ID = max(t[i].IF + 1, i > 0 ? t[i - 1].EX : 0);
        int ready = 0; /* the first cycle this instruction's EX can use its sources */
        int src[2] = {prog[i].src1, prog[i].src2};
        for (int s = 0; s < 2; s++) {
            int w = src[s] != 0 ? last_writer[src[s]] : -1;
            if (w >= 0) {
                /* forwarding: an ALU result is ready after its EX, a load's after its MEM */
                int at = strcmp(prog[w].kind, "load") == 0 ? t[w].MEM + 1 : t[w].EX + 1;
                ready = max(ready, at);
            }
        }
        t[i].EX = max(max(t[i].ID + 1, i > 0 ? t[i - 1].MEM : 0), ready);
        t[i].MEM = t[i].EX + 1;
        t[i].WB = t[i].MEM + 1;
        stalls += t[i].EX - t[i].ID - 1;
        if (prog[i].dest != 0) {
            last_writer[prog[i].dest] = i;
        }
        next_if = t[i].ID;
        if (strcmp(prog[i].kind, "branch") == 0 && prog[i].taken) {
            next_if = t[i].EX + 1; /* resolved in EX: the two fetched after it are flushed */
            flushes += 2;
        }
    }

    for (int i = 0; i < n; i++) {
        printf("%-20s IF %2d  ID %2d  EX %2d  MEM %2d  WB %2d\n", prog[i].text, t[i].IF, t[i].ID, t[i].EX, t[i].MEM, t[i].WB);
    }
    int cycles = n > 0 ? t[n - 1].WB : 0;
    printf("%d instructions, %d cycles, %d stall cycles, %d flushed, CPI %.2f\n", n, cycles, stalls, flushes, n > 0 ? (double) cycles / n : 0.0);
    return 0;
}
