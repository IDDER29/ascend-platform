	.file	"source.c"
	.text
	.p2align 4
	.globl	scale
	.type	scale, @function
scale:
	endbr64
	leal	3(%rdi,%rdi,4), %eax
	ret
	.size	scale, .-scale
	.p2align 4
	.globl	eighth
	.type	eighth, @function
eighth:
	endbr64
	movl	%edi, %eax
	shrl	$3, %eax
	ret
	.size	eighth, .-eighth
	.p2align 4
	.globl	clamp
	.type	clamp, @function
clamp:
	endbr64
	xorl	%eax, %eax
	testl	%edi, %edi
	cmovns	%edi, %eax
	ret
	.size	clamp, .-clamp
	.p2align 4
	.globl	is_zero
	.type	is_zero, @function
is_zero:
	endbr64
	xorl	%eax, %eax
	testl	%edi, %edi
	sete	%al
	ret
	.size	is_zero, .-is_zero
	.section	.rodata.str1.1,"aMS",@progbits,1
.LC0:
	.string	"%d %u %d %d\n"
	.section	.text.startup,"ax",@progbits
	.p2align 4
	.globl	main
	.type	main, @function
main:
	endbr64
	subq	$8, %rsp
	movl	$1, %r9d
	xorl	%r8d, %r8d
	xorl	%eax, %eax
	movl	$12, %ecx
	movl	$23, %edx
	movl	$.LC0, %esi
	movl	$2, %edi
	call	__printf_chk
	xorl	%eax, %eax
	addq	$8, %rsp
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
