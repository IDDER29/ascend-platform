	.file	"source.c"
	.text
	.globl	square
	.type	square, @function
square:
	endbr64
	pushq	%rbp
	movq	%rsp, %rbp
	movl	%edi, -4(%rbp)
	movl	-4(%rbp), %eax
	imull	%eax, %eax
	popq	%rbp
	ret
	.size	square, .-square
	.globl	sum_squares
	.type	sum_squares, @function
sum_squares:
	endbr64
	pushq	%rbp
	movq	%rsp, %rbp
	pushq	%rbx
	subq	$8, %rsp
	movl	%edi, -12(%rbp)
	movl	%esi, -16(%rbp)
	movl	-12(%rbp), %eax
	movl	%eax, %edi
	call	square
	movl	%eax, %ebx
	movl	-16(%rbp), %eax
	movl	%eax, %edi
	call	square
	addl	%ebx, %eax
	movq	-8(%rbp), %rbx
	leave
	ret
	.size	sum_squares, .-sum_squares
	.section	.rodata
.LC0:
	.string	"%d\n"
	.text
	.globl	main
	.type	main, @function
main:
	endbr64
	pushq	%rbp
	movq	%rsp, %rbp
	movl	$4, %esi
	movl	$3, %edi
	call	sum_squares
	movl	%eax, %esi
	movl	$.LC0, %edi
	movl	$0, %eax
	call	printf
	movl	$0, %eax
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
