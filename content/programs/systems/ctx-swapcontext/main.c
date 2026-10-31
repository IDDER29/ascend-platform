#define _XOPEN_SOURCE 700
#include <stdio.h>
#include <ucontext.h>

/* Two contexts: each is a saved set of registers (PC, SP and the rest) plus a stack. */
static ucontext_t main_ctx, task_ctx;
static char task_stack[64 * 1024];

static void task(void) {
    for (int i = 1; i <= 3; i++) {
        printf("task: step %d, switching back\n", i);
        swapcontext(&task_ctx, &main_ctx); /* save my registers, load main's */
    }
}

int main(void) {
    getcontext(&task_ctx);
    task_ctx.uc_stack.ss_sp = task_stack;
    task_ctx.uc_stack.ss_size = sizeof task_stack;
    task_ctx.uc_link = &main_ctx;
    makecontext(&task_ctx, task, 0);

    for (int i = 1; i <= 3; i++) {
        printf("main: round %d, switching to task\n", i);
        swapcontext(&main_ctx, &task_ctx); /* save main's registers, load the task's */
    }
    printf("main: done\n");
    return 0;
}
