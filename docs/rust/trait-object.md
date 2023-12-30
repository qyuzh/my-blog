---
date: 2023-12-03 12:13
sticky: 0
tags:
  - Rust
---

# What exactly is a trait object?

A trait object consists of _two_ addresses: one points to the actual data, and another is to the _vtable_ which is a data structure that stores all the functions that object has implemented for that trait.

```rust
use std::mem::{size_of, size_of_val};

struct Dog {}

trait Behavior {
    fn bark(&self);
}

impl Behavior for Dog {
    fn bark(&self) {
        println!("bark");
    }
}

fn test(animal: &dyn Behavior) {
    println!("{}", size_of_val(&animal)); // 16 bytes
    animal.bark();
}

fn main() {
    let dog = Dog {};
    println!("{}", size_of_val(&dog)); // 0 bytes
    println!("{}", size_of::<&dyn Behavior>()); // 16 bytes
    test(&dog);
}
```

**References**

1. https://www.reddit.com/r/rust/comments/bylvpu/what_exactly_is_a_trait_object_and_how_is_it/
