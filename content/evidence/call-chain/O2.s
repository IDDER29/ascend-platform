	.file	"source.c"
	.text
	.p2align 4
	.globl	square
	.type	square, @function
square:
	endbr64
	imull	%edi, %edi
	movl	%edi, %eax
	ret
	.size	square, .-square
	.p2align 4
	.globl	sum_squares
	.type	sum_squares, @function
sum_squares:
	endbr64
	imull	%edi, %edi
	imull	%esi, %esi
	leal	(%rdi,%rsi), %eax
	ret
	.size	sum_squares, .-sum_squares
	.section	.rodata.str1.1,"aMS",@progbits,1
.LC0:
	.string	"%d\n"
	.section	.text.startup,"ax",@progbits
	.p2align 4
	.globl	main
	.type	main, @function
main:
	endbr64
	subq	$8, %rsp
	movl	$25, %edx
	movl	$.LC0, %esi
	xorl	%eax, %eax
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
