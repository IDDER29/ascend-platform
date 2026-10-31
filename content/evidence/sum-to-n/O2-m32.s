	.file	"function.c"
	.text
	.p2align 4
	.globl	sum_to
	.type	sum_to, @function
sum_to:
	pushl	%ebx
	movl	8(%esp), %ecx
	testl	%ecx, %ecx
	je	.L4
	leal	-1(%ecx), %ebx
	movl	$1, %edx
	movl	$2, %eax
	cmpl	$2, %ecx
	jb	.L1
	andl	$1, %ebx
	je	.L3
	movl	$3, %edx
	movl	$3, %eax
	cmpl	$3, %ecx
	jb	.L1
	.p2align 4
	.p2align 4
	.p2align 3
.L3:
	leal	1(%edx,%eax,2), %edx
	addl	$2, %eax
	cmpl	%eax, %ecx
	jnb	.L3
.L1:
	movl	%edx, %eax
	popl	%ebx
	ret
	.p2align 4,,10
	.p2align 3
.L4:
	xorl	%edx, %edx
	popl	%ebx
	movl	%edx, %eax
	ret
	.size	sum_to, .-sum_to
	.ident	"GCC: (Ubuntu 15.2.0-16ubuntu1) 15.2.0"
	.section	.note.GNU-stack,"",@progbits
