	.file	"source.c"
	.text
	.globl	scale
	.type	scale, @function
scale:
	endbr64
	pushq	%rbp
	movq	%rsp, %rbp
	movl	%edi, -4(%rbp)
	movl	-4(%rbp), %edx
	movl	%edx, %eax
	sall	$2, %eax
	addl	%edx, %eax
	addl	$3, %eax
	popq	%rbp
	ret
	.size	scale, .-scale
	.globl	eighth
	.type	eighth, @function
eighth:
	endbr64
	pushq	%rbp
	movq	%rsp, %rbp
	movl	%edi, -4(%rbp)
	movl	-4(%rbp), %eax
	shrl	$3, %eax
	popq	%rbp
	ret
	.size	eighth, .-eighth
	.globl	clamp
	.type	clamp, @function
clamp:
	endbr64
	pushq	%rbp
	movq	%rsp, %rbp
	movl	%edi, -4(%rbp)
	movl	-4(%rbp), %eax
	movl	$0, %edx
	testl	%eax, %eax
	cmovs	%edx, %eax
	popq	%rbp
	ret
	.size	clamp, .-clamp
	.globl	is_zero
	.type	is_zero, @function
is_zero:
	endbr64
	pushq	%rbp
	movq	%rsp, %rbp
	movl	%edi, -4(%rbp)
	cmpl	$0, -4(%rbp)
	sete	%al
	movzbl	%al, %eax
	popq	%rbp
	ret
	.size	is_zero, .-is_zero
	.section	.rodata
.LC0:
	.string	"%d %u %d %d\n"
	.text
	.globl	main
	.type	main, @function
main:
	endbr64
	pushq	%rbp
	movq	%rsp, %rbp
	pushq	%r13
	pushq	%r12
	pushq	%rbx
	subq	$8, %rsp
	movl	$0, %edi
	call	is_zero
	movl	%eax, %r13d
	movl	$-7, %edi
	call	clamp
	movl	%eax, %r12d
	movl	$100, %edi
	call	eighth
	movl	%eax, %ebx
	movl	$4, %edi
	call	scale
	movl	%r13d, %r8d
	movl	%r12d, %ecx
	movl	%ebx, %edx
	movl	%eax, %esi
	movl	$.LC0, %edi
	movl	$0, %eax
	call	printf
	movl	$0, %eax
	addq	$8, %rsp
	popq	%rbx
	popq	%r12
	popq	%r13
	popq	%rbp
	ret
	.size	main, .-main
	.ident	"GCC: (Ubuntu 15.2.0-16ubuntu1) 15.2.0"
	.section	.note.GNU-stack,"",@progbits
	.section	.note.gnu.property,"a"
	.align 8
	.long	1f - 0f
	.long	4f - 1f
	.long	5
0:
	.string	"GNU"
1:
	.align 8
	.long	0xc0000002
	.long	3f - 2f
2:
	.long	0x3
3:
	.align 8
4:
