	.file	"source.c"
	.text
	.p2align 4
	.globl	sum_to
	.type	sum_to, @function
sum_to:
	endbr64
	testl	%edi, %edi
	je	.L4
	leal	-1(%rdi), %ecx
	movl	$1, %edx
	movl	$2, %eax
	cmpl	$2, %edi
	jb	.L1
	andl	$1, %ecx
	je	.L3
	movl	$3, %edx
	movl	$3, %eax
	cmpl	$3, %edi
	jb	.L1
	.p2align 4
	.p2align 4
	.p2align 3
.L3:
	leal	1(%rdx,%rax,2), %edx
	addl	$2, %eax
	cmpl	%eax, %edi
	jnb	.L3
.L1:
	movl	%edx, %eax
	ret
	.p2align 4,,10
	.p2align 3
.L4:
	xorl	%edx, %edx
	movl	%edx, %eax
	ret
	.size	sum_to, .-sum_to
	.section	.rodata.str1.1,"aMS",@progbits,1
.LC0:
	.string	"%u\n"
	.section	.text.startup,"ax",@progbits
	.p2align 4
	.globl	main
	.type	main, @function
main:
	endbr64
	subq	$8, %rsp
	movl	$55, %edx
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
