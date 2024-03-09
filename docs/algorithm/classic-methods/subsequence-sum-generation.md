---
tags:
  - Algorithm
---

# 如何生成一个非减非负序列的所有子序列的和?

## Analysis

例如, 序列 `[1,2,4]`, 生成方法如下.

- 1-th: `[]`, 从空序列开始
- 2-th: `[1]`, 在 `[]` 末尾添加 1 得到
- 3-th: `[2]`, 替换 `[1]` 中最后一个值为 2 得到
- 4-th: `[1, 2]`, 在 `[1]` 中添加一个值 2 得到

不断重复上述步骤即可. 可用最小堆实现.

## Code

::: code-group

```rust
/// Run in O(nlogn + klogn)/O(k)
/// # Args
/// - nums[i] >= 0
/// - k > 0
fn k_smallest_seq_sum(mut nums: Vec<i32>, mut k: i32) -> i64 {
    if nums.len() == 0 || k == 1 {
        return 0;
    }

    nums.sort_unstable();

    let mut pq = std::collections::BinaryHeap::new();
    pq.push(Reverse((nums[0] as i64, 1)));
    while k > 2 {
        let Reverse((s, i)) = pq.pop().unwrap(); // SAFETY: obvious

        if i < nums.len() {
            pq.push(Reverse((s + nums[i] as i64, i + 1))); // 增加
            pq.push(Reverse((s + nums[i] as i64 - nums[i - 1] as i64, i + 1))); // 替换
        }

        k -= 1;
    }

    pq.pop().unwrap().0 .0 // SAFETY: there must are an element in it
}
```

::: code-group
