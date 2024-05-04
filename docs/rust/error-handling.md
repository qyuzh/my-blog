---
tags:
  - Rust
---

# Error Management in Rust

Rust groups errors into two major categories: recoverable and unrecoverable errors.

- Unrecoverable Errors with `panic!()` that ends the program immediately without cleaning up.
- Recoverable Errors with `Result<T, E>` that gives the calling code the option to how to process the unexpected result.

## Propagating results: `?` operator

- It will return `Err(From::from(e))` from the enclosing function or closure, if the value is `Err(e)`.
- It will unwrap the value to evaluate to `x`, if applied to `Ok(x)`.

## When to use recoverable/unrecoverable errors?

- It's ok call `unwrap`/`expect` in examples, prototyping and tests.
- Should panic when code could end up in a bad state: some assumption, guarantee, contract, or invariant has been broken.

## `Error` trait

`Result<T, E>` enforces no bound on the error type.

## Implement Error trait with `thiserror`

The [`thiserror`](https://docs.rs/thiserror/latest/thiserror/) crate provides macros for the standard library's `std::error::Error` trait.

```rust
#[derive(Error, Debug)]                                                   
pub enum DataStoreError {
    #[error("data store disconnected")]                                   
    Disconnect(#[from] io::Error),
    #[error("the data for key `{0}` is not available")]                   
    Redaction(String),
    #[error("invalid header (expected {expected:?}, found {found:?})")]   
    InvalidHeader {
        expected: String,
        found: String,
    }
}
```

## Propagate Result with `anyhow`

The [`anyhow`](https://docs.rs/anyhow/latest/anyhow/) provides `anyhow::Error`, a trait object based error type for easy idiomatic error handling in Rust applications.
