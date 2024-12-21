# Introduction to Assembly

## x86-64 assembly

Instructions are the way we tell the CPU what to do. It consists of **operator** and **operands**(a list of 0-3 items).

```asm
mov rax, rbx
```

Commonly,

- `operand 1`, is the target of the operation
- `operand 2`, is the source of the operation

## Registers

In x86-64 there are 16 registers.

- `rip`, register instruction pointer, the only non-general-purpose register

| Register | Higher byte | Lower byte | Lower 2 bytes¹ | Lower 4 bytes² |
|----------|--------------|------------|----------------|----------------|
| rax      | ah           | al         | ax             | eax            |
| rcx      | ch           | cl         | cx             | ecx            |
| rbx      | bh           | bl         | bx             | ebx            |
| rdx      | dh           | dl         | dx             | edx            |
| rsp      |              | spl        | sp             | esp            |
| rsi      |              | sil        | si             | esi            |
| rdi      |              | dil        | di             | edi            |
| rbp      |              | bpl        | bp             | ebp            |
| r8       |              | r8b        | r8w            | r8d            |
| r9       |              | r9b        | r9w            | r9d            |
| r10      |              | r10b       | r10w           | r10d           |
| r11      |              | r11b       | r11w           | r11d           |
| r12      |              | r12b       | r12w           | r12d           |
| r13      |              | r13b       | r13w           | r13d           |
| r14      |              | r14b       | r14w           | r14d           |
| r15      |              | r15b       | r15w           | r15d           |

## Hello, World

```asm
section .data
  ; We define the constant `msg`, the string to print.
  ; We use the `db` (define byte) directive to define 
  ; constants of one or more bytes (1 char = 1 byte).
  msg db `Hello, World!\n`

section .text
  global _start
_start:
  ; We call the sys_write syscall to print on the 
  ; screen. Syscalls  are invoked with `syscall` and
  ; they are identified by a number.
  ;
  ; The identifier for sys_write is 1. The `syscall`
  ; intruction will look for the instruction id in the
  ; register `rax`. So we move 1 in there.
  mov rax, 1
  
  ; The system call to invoke has the signature:
  ;
  ;   size_t sys_write(uint fd, const char* buf, size_t count)
  
  ; The `syscall` instruction wants the first argument
  ; in `rdi`. In this case, the first argument is the
  ; file descriptor of where to write the output.
  ; We will use 1, which identifies the standard output.
  mov rdi, 1
  
  ; The second argument is expected to be in `rsi` and
  ; the signature tells us that it the string we want
  ; to print. We defined the buffer in the .data section
  ; (it's `msg`), so we just need to move it to `rsi`
  mov rsi, msg
  
  ; `rdx` is the register for the third argument. 
  ; We see in the signature that this is the count of
  ; characters we want to print.
  ;
  ; Note: the string is null-terminated, that is, there
  ; is an ending "ghost" character we need to account for.
  mov rdx, 14
  
  ; We're now finally issuing the syscall
  syscall
  ; Now the message is printed! Time to exit the program.

  ; Same as above, we invoke `syscall` with 60, which is
  ; `exit` and has the following signature:
  ;
  ;   void exit(int status)
  
  ; Once again, `syscall` looks for the identifier in 
  ; `rax`. We move 60, the identifier for `exit`, there
  mov rax, 60
  
  ; Again, `rdi` is where the first argument is expected
  ; to be found.
  ; The first argument is the status code (see signature)
  ; so we put 0 for a clean exit.
  mov rdi, 0
  
  ; Issuing the `exit` syscall and cleanly exiting 
  ; the program
  syscall
```

## Reference

1. <https://shikaan.github.io/assembly/x86/guide/2024/09/08/x86-64-introduction-hello.html>
