---
tags:
  - Rust
  - Algorithm
  - List
---

# Rust List Problem Collections

## P83, Leetcode

Problem Description: https://leetcode.cn/problems/remove-duplicates-from-sorted-list/description/

Code

::: code-group

```rust
impl Solution {
    pub fn delete_duplicates(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let mut p = &mut head;
        while let Some(n1) = p {
            while let Some(mut n2) = n1.next.take() {
                if n1.val == n2.val {
                    n1.next = n2.next.take();
                } else {
                    n1.next = Some(n2);
                    break;
                }
            }
            p = &mut n1.next;
        }
        head
    }
}
```

:::


## P2807, Leetcode

Problem Description: https://leetcode.cn/problems/insert-greatest-common-divisors-in-linked-list/description/

::: code-group

```rust
pub fn insert_greatest_common_divisors(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut p = &mut head;
    while let Some(p2) = p {
        let p3 = p2.next.take();
        match &p3 {
            Some(p3r) => {
                let mut mid = ListNode::new(gcd(p2.val, p3r.val));
                mid.next = p3;
                p2.next = Some(Box::new(mid));
                // SAFETY: p2 and p3 all exist imply p.next.next exists
                p = &mut p2.next.as_mut().unwrap().next
            }
            None => break,
        }
    }
    head
}

fn gcd(mut a: i32, mut b: i32) -> i32 {
    while b != 0 {
        (a, b) = (b, a % b)
    }
    a
}
```

:::