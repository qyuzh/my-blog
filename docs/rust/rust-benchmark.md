---
tags:
  - Rust
---

# Rust Benchmark

## What's benckmarking?

Benchmarking typically involves comparing the *performance* of two or more programs that do the same thing. Two or more different programs, or, two different versions of the same program that lets us reliably answer the question "did this change speed things up?"

## Benchmark in Rust

First, enable test feature by add *inner attributes* `#![feature(test)]`. Second, import `Bencher` from test lib. Third, write workloads to measure. Finally, execute `cargo bench`.

```rust
#![feature(test)]
#![allow(unused)]

extern crate test;

use std::mem::replace;
use test::Bencher;

// bench: find the `BENCH_SIZE` first terms of the fibonacci sequence
const BENCH_SIZE: usize = 20;

// recursive fibonacci
fn fibonacci(n: usize) -> u32 {
    if n < 2 {
        1
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

// iterative fibonacci
struct Fibonacci {
    curr: u32,
    next: u32,
}

impl Iterator for Fibonacci {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        let new_next = self.curr + self.next;
        let new_curr = replace(&mut self.next, new_next);

        Some(replace(&mut self.curr, new_curr))
    }
}

fn fibonacci_sequence() -> Fibonacci {
    Fibonacci { curr: 1, next: 1 }
}

// function to benchmark must be annotated with `#[bench]`
#[bench]
fn recursive_fibonacci(b: &mut Bencher) {
    // exact code to benchmark must be passed as a closure to the iter
    // method of Bencher
    b.iter(|| (0..BENCH_SIZE).map(fibonacci).collect::<Vec<u32>>())
}

#[bench]
fn iterative_fibonacci(b: &mut Bencher) {
    b.iter(|| fibonacci_sequence().take(BENCH_SIZE).collect::<Vec<u32>>())
}
```