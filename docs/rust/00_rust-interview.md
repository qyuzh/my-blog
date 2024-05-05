---
publish: true
tags:
  - Rust
---

# Rust Interview

## 专业技术能力

### Q1 - 解释Ownership Rules -> 如何提前释放一个值的内存

- Each value in Rust has an owner.
- There can only be one owner at a time.
- When the owner goes out of scope, the value will be dropped.

两种方式: drop {}

### Q2 - 解释String的结构 -> `&String` 和 `&str` 的区别 -> 内存大小(64位机器上)

![&String](https://doc.rust-lang.org/book/img/trpl04-05.svg)

![&str](https://doc.rust-lang.org/book/img/trpl04-06.svg)

String(24 Bytes)

reference(8 Bytes) 和 slice(16 Bytes) 的区别

值大小测定

```rust

```

### Q3 - 解释Move/Copy语义的区别 -> 那些值实现了Move语义, 那些值实现了Copy语义 -> 为什么实现了Copy就不能实现Drop?

Move语义转移ownership, ownership转移后, 原owner失效, 不能再使用.
Copy语义对值的进行复制, 出现两个值.

各种primitives, 比如number, bool实现了 Copy 语义
`*const T` 实现了 Copy 语义
`*mut T` 实现了 Copy 语义
`&T` 实现了 Copy 语义
`&mut T`没有实现 Copy语义, 它是Move语义. Rust默认移动语义

Copy 语义的复制方式是, 对栈上的值*按位*复制. Drop 定义了如何清理资源. 同时实现会导致double free问题. 编译器作出了限制.

### Q4 - 解释lifetime机制的作用 -> 解释如下生命周期标注的含义 -> lifetime标注会改变值的生命周期么? -> Lifetime Elision

Rather than ensuring that a type has the behavior we want, lifetimes ensure that references are valid as long as we need them to be.

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

不会改变值的生命周期, 生命周期标注只是为了帮助编译器分析reference的合法时间, 但编译器无法推断的时候.

- The compiler assigns a lifetime parameter to each parameter that’s a reference
- If there is exactly one input lifetime parameter, that lifetime is assigned to all output lifetime parameters
- If there are multiple input lifetime parameters, but one of them is `&self` or `&mut self` because this is a method, the lifetime of `self` is assigned to all output lifetime parameters

### Q5 - Rust如何做到所谓的Fearless Concurrency -> 解释Sync和Send trait的作用 -> 两者关系 -> 解释如下函数签名

- Allowing Transference of Ownership Between Threads with Send
- Allowing Access from Multiple Threads with Sync

Any type T is Sync if `&T` (an *immutable* reference to T) is Send, meaning the reference can be sent safely to another thread

`Rc<T>` 是 Send? Sync? 都是不是, both threads might update the reference count at the same time

```rust
pub fn spawn<F, T>(f: F) -> JoinHandle<T>
where
    F: FnOnce() -> T + Send + 'static,
    T: Send + 'static,
```

### Q6 - 错误处理: 解释`?`operator的作用 -> 你在使用时候会使用unwrap和expect之类的函数?

错误传播

- It will return `Err(From::from(e))` from the enclosing function or closure, if the value is `Err(e)`.
- It will unwrap the value to evaluate to `x`, if applied to `Ok(x)`.

尽量少用, 而使用Result错误处理 在生产代码中对unwrap/expect等之类会导致panic的函数

### Q7 - todo

## 目标感

你对你的职业发展有明确的目标吗？能分享一下你的短期和长期职业目标吗？

## 学习能力

请评价一下你自己的学习能力. 结合你过往经历说明.

## 抗压能力

如果任务失败了或出现了问题，你会如何处理？你是如何对待自己的错误并从中学习？ 结合你过往经历说明.
