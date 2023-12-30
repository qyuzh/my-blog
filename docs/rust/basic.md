---
title: Rust Summary based on The Book
date: 2023-11-30T14:00+08:00
sticky: 100
tags:
  - Rust
---

# Rust Summary based on [The Book](https://doc.rust-lang.org/stable/book/)

## Variables and Mutability

By default, variable in Rust is _immutable_ and can make them _mutable_ by adding `mut` in front of the variable name.

```rust
let x = 5; // immutable variable
let mut y = 5; // mutable variable
```

A variable can be _shadowed_ by another, that's called _Shadowing_.

```rust
let x = 5;
let x = 5 + 1;
{
    let x = x * 2;
    assert_eq!(x, 12);
}

let mut spaces = "  ";
// spaces = spaces.len(); // error: spaces is type of &str
```

_Constants_ are always immutable and handled at the _compile time_; it's not the result of a value that could only be computed at _runtime_. The compiler will NOT infer the type of a constant.

```rust
const PROGRAM_NAME: &str = "Rust Example";
```

## Data Types

### Scalar Types

Rust has four primary scalar types: integer, floating-point number, boolean, and character.

#### Integer

| Length  | Signed  | Unsigned |
| ------- | ------- | -------- |
| 8-bit   | `i8`    | `u8`     |
| 16-bit  | `i16`   | `u16`    |
| 32-bit  | `i32`   | `u32`    |
| 64-bit  | `i64`   | `u64`    |
| 128-bit | `i128`  | `u128`   |
| arch    | `isize` | `usize`  |

| Number literals  | Example       |
| ---------------- | ------------- |
| Decimal          | `98_222`      |
| Hex              | `0xff`        |
| Octal            | `0o77`        |
| Binary           | `0b1111_0000` |
| Byte (`u8` only) | `b'A'`        |

#### Floating-point

Floating-point numbers are represented according to the _IEEE-754_ standard.

```rust
let x = 2.0; // f64, by default
let y: f32 = 3.0; // f32
```

#### Boolean

The main way to use Boolean values is through conditionals, such as an `if` expression.

```rust
let t = true;
let f: bool = false; // with explicit type annotation
```

#### Character

Rust’s `char` type is **four** bytes in size and represents a _Unicode Scalar Value_.

```rust
fn main() {
    let c = 'z';
    let z: char = 'ℤ'; // with explicit type annotation
    let heart_eyed_cat = '😻';
}
```

### Compound Types

Compound types can group multiple values into one type. Rust has two primitive compound types: _tuple_ and _array_.

#### Tuple

A *tuple* is a general way of grouping together a number of values with a **variety of types** into one compound type. Tuples have a **fixed length**: once declared, they cannot grow or shrink in size.

```rust
fn main() {
    let tup = (500, 6.4, 1);
    let (x, y, z) = tup; // destructuring
}
```

#### Array

Same type with fixed length.

```rust
fn main() {
    let a = [1, 2, 3, 4, 5]; // a: [i32; 5]
}
```

## Statements and Expressions

Because Rust is an expression-based language, even functions are expression.

- **Statements** are instructions that perform some action and do not return a value.
- **Expressions** evaluate to a resultant value. Let’s look at some examples.

```rust
let x = (let y = 6); // error: expected expression, found `let` statement

fn five() -> i32 {
    5 // expression, it's ok
}
```

## Control Flow

### `if` Expressions

Rust will not automatically try to convert non-Boolean types to a Boolean.

```rust
fn main() {
    let number = 3;
    if number < 5 {
        println!("condition was true");
    }

    if number { // error: expected `bool`, found integer
        println!("number was three");
    }

    // using if in a let Statement
    let number = if condition { 5 } else { 6 };
}
```

### `loop`

Returning Values from Loops

```rust
fn main() {
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2;
        }
    };
    println!("The result is {result}");
}
```

Loop _labels_ to disambiguate between multiple loops

```rust
fn main() {
    let mut count = 0;
    'counting_up: loop {
        count += 1;
        loop {
            if count == 20 {
                break 'counting_up;
            }
            count += 1;
        }
    }
    println!("End count = {count}");
}
```

### `while`

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];
    let mut index = 0;
    while index < 5 {
        println!("the value is: {}", a[index]);
        index += 1;
    }
}
```

### `for in`

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];
    for element in a {
        println!("the value is: {element}");
    }
}
```

## Ownership

*Ownership* is a set of rules that govern how a Rust program manages memory. The rules are:

- Each value in Rust has an _owner_.

- There can be only one owner at a time.

- When the owner goes out of _scope_, the value will be _dropped_.

### Program Memory

RoData, heap, stack and so on.

### Move vs Copy

By default, variable bindings have _move_ semantics.

[`Clone`](https://doc.rust-lang.org/std/clone/trait.Clone.html 'trait std::clone::Clone') is a _supertrait_ of `Copy`, so everything which is `Copy` must also implement [`Clone`](https://doc.rust-lang.org/std/clone/trait.Clone.html 'trait std::clone::Clone'). If a type is `Copy` then its [`Clone`](https://doc.rust-lang.org/std/clone/trait.Clone.html 'trait std::clone::Clone') implementation only needs to return `*self`.

Generalizing the latter case, any type implementing [`Drop`](https://doc.rust-lang.org/std/ops/trait.Drop.html 'trait std::ops::Drop') can't be `Copy`, because it’s managing some resource besides its own [`size_of::<T>`](https://doc.rust-lang.org/std/mem/fn.size_of.html 'fn std::mem::size_of') bytes.

### References

The rules of references:

- At any given time, you can have *either* one mutable reference *or* any number of _immutable_ references.
- References must always be valid.

A slice is a kind of reference.

```rust
let s = String::from("hello world");
let world = &s[6..11];
```

![reference](https://doc.rust-lang.org/stable/book/img/trpl04-06.svg 'Memory layout of References')

## Lifetime

A variety of generics that give the compiler information about how references relate to each other. Lifetimes allow us to give the compiler enough information about borrowed values so that it can ensure references will be valid in more situations than it could without our help.

### Lifetime Elision

- The compiler assigns a lifetime parameter to each parameter that’s a reference

- If there is exactly one input lifetime parameter, that lifetime is assigned to all output lifetime parameters

- If there are multiple input lifetime parameters, but one of them is `&self` or `&mut self` because this is a method, the lifetime of `self` is assigned to all output lifetime parameters

## Functional programming

- Closures, a function-like construct you can store in a variable

- Iterators, a way of processing series of elements.

### Closures

- `FnOnce`, applies to closures that can be called once. A closure that moves captured values out of its body will **only** implement `FnOnce` and none of the other `Fn` traits, because it can only be called once.

- `FnMut`, applies to closures that **don't** move captured values out of their body, but that might mutate the captured values.

- `Fn`, applies to closures that **don't** move captured values out of their body and that **don't** mutate captured values, as well as closures that capture **nothing** from their environment.

### Iterators

- _Consuming adaptors_, call `next` on an iterator that will use up the iterator.

- _Iterator adaptors_, are methods defined on `Iterator` trait that **don't** consume the iterator, instead, they **produce** different iterators by changing some aspect of the original iterator.

### `Deref` Trait

- Treating a type like a reference by implementing the `Deref` trait.

- *Deref coercion* converts a reference to a type that implements the `Deref` trait into a reference to another type

## `size_of` Test

```rust
// assume on 64-bit platform
fn main() {
    let t = ['1', '2', '3'];
    let p = &t[..2];
    let p1 = &t[..];
    let reference = &p;

    println!("{}", size_of::<char>()); // 4 bytes
    println!("{}", size_of::<[char; 3]>()); // 12 bytes
    println!("{}", size_of_val(&t)); // 12 bytes
    println!("{}", size_of_val(&p)); // 16 bytes, slice
    println!("{}", size_of_val(&p1)); // 16 bytes, slice
    println!("{}", size_of_val(&reference)); // 8 bytes, reference
    println!("{}", size_of::<Option<i128>>()); // 24 bytes = 16 bytes + 8 bytes discriminant
    println!("{}", size_of::<Option<&i128>>()); // 8 bytes, optimization for reference, no discriminant
}
```

## Other

- Trait bounds on generics, static dispatch, monomorphization

- Trait object, dynamic dispatch, runtime cost

- Fully Qualified Syntax to disambiguate overlapping traits' methods

- `Ord/PartialOld`, `Eq/PartialEq`.

## Global variables

Articles:

- [Rust global variables, two years on](https://morestina.net/blog/2055/rust-global-variables-two-years-on#comments), Nov 26, 2023

## Raw String Literals

Syntax such as `r""`, or `r#""#`, `r##""##` and so on.

## Test

To place unit tests in the module they test and integration tests in their own `tests/` directory.

## Build

[cargo build - The Cargo Book](https://doc.rust-lang.org/cargo/commands/cargo-build.html)

- [Build Scripts - The Cargo Book](https://doc.rust-lang.org/cargo/reference/build-scripts.html)
