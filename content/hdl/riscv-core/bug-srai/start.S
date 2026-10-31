# Set up the stack at the top of memory, run main, then stop the simulation.
    .section .text.start
    .globl _start
_start:
    li   sp, 0x3FF0
    call main
    li   t0, 0xFFF4
    sw   a0, 0(t0)
1:  j    1b
