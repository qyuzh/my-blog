---
date: 2023-12-02 14:22
sticky: 99
description: A closure is just an anonymous struct containing the captured values...Actually, closures can capture values from their environment in three ways
tags:
  - Rust
---

# What actually is a closure?

A closure is just an _anonymous struct_ containing the captured values in three ways: borrowing immutably(`Fn`), borrowing mutably(`FnMut`), and taking ownership(`FnOnce`). The closure will decide which of these to use based on **what the body of the function does with the captured values**.

- `FnOnce`, applies to closures that can be called once. A closure that moves captured values out of its body will **only** implement `FnOnce` and none of the other `Fn` traits, because it can only be called once.

- `FnMut`, applies to closures that **don't** move captured values out of their body, but that might mutate the captured values.

- `Fn`, applies to closures that **don't** move captured values out of their body and that **don't** mutate captured values, as well as closures that capture **nothing** from their environment.

The following code with a closure

```rust
let mut count: usize = 0;
let mut counter = || { count += 1; count };
assert_eq!(counter(), 1);
assert_eq!(counter(), 2);
assert_eq!(counter(), 3);
```

is roughly equivalent to the following code with a struct.

```rust
struct Counter {
    count: usize
}

impl std::ops::FnMut<()> for Counter {
    type Output = usize;
    fn call_mut(&mut self, args: ()) -> Self::Output {
        self.count += 1;
        self.count
    }
}

let mut counter = Counter { 0 };
assert_eq!(counter(), 1);
assert_eq!(counter(), 2);
assert_eq!(counter(), 3)
```

Full working code: https://play.rust-lang.org/?version=nightly&mode=debug&edition=2018&gist=07ce9e7625cccaf04fc69d668e2a3203

**Reference**

1. https://www.reddit.com/r/rust/comments/i0cbnz/what_actually_is_a_closure/
2. https://doc.rust-lang.org/reference/types/closure.html#closure-types
3. https://doc.rust-lang.org/book/ch13-01-closures.html
