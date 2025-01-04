---
tags:
    - Segment Tree
    - Leetcode
---

# Segment Tree

## P732, Leetcode

My Calendar III needs to find the maximum number of concurrent events at any time. We can solve this problem by using a segment tree.

Examples:

```plaintext
Time:        5         10         15         20         40         50         60
Events:      |----------[5,15)-----|
                       |----------[10,20)------|
                       |------------------[10,40)--------|
                                                                   |--[50,60)--|
Overlaps:        1         3           2             1                   1     
```

## Implementation

```rust
struct MyCalendarThree {
    tree: Node,
}

impl MyCalendarThree {
    const N: usize = 1e9 as usize;

    fn new() -> Self {
        Self {
            tree: Node::new(0, MyCalendarThree::N),
        }
    }

    fn book(&mut self, start_time: i32, end_time: i32) -> i32 {
        let l = start_time as usize;
        let r = end_time as usize - 1;
        self.tree.update(l, r, 1);
        self.tree.query(0, MyCalendarThree::N) as i32
    }
}

/// Segment Tree Node
struct Node {
    l: usize,
    r: usize,
    mid: usize,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
    v: usize,
    lazy: usize, // lazy updated to children
}

impl Node {
    /// Represents `[l, r]` not `[l, r)`
    fn new(l: usize, r: usize) -> Self {
        Self {
            l,
            r,
            mid: (l + r) >> 1,
            left: None,
            right: None,
            v: 0,
            lazy: 0,
        }
    }

    fn update(&mut self, l: usize, r: usize, v: usize) {
        if l > r {
            return;
        }

        if l <= self.l && self.r <= r {
            self.v += v;
            self.lazy += v; // record lazy value that may update to children when pushdown
            return;
        }

        self.pushdown();

        if l <= self.mid {
            self.left_mut().update(l, r, v);
        }
        if r > self.mid {
            self.right_mut().update(l, r, v);
        }

        self.pushup();
    }

    fn query(&mut self, l: usize, r: usize) -> usize {
        if l > r {
            return 0;
        }

        if l <= self.l && self.r <= r {
            return self.v;
        }

        self.pushdown();

        let mut v = 0;
        if l <= self.mid {
            v = v.max(self.left_mut().query(l, r));
        }
        if r > self.mid {
            v = v.max(self.right_mut().query(l, r));
        }
        v
    }

    fn pushup(&mut self) {
        // Update according to specific problem
        self.v = self.left_mut().v.max(self.right_mut().v)
    }

    fn pushdown(&mut self) {
        if self.lazy != 0 {
            self.left_mut().v += self.lazy;
            self.right_mut().v += self.lazy;
            self.left_mut().lazy += self.lazy;
            self.right_mut().lazy += self.lazy;
            self.lazy = 0; // Has been updated to children, reset
        }
    }

    fn right_mut(&mut self) -> &mut Node {
        self.right
            .get_or_insert_with(|| Box::new(Node::new(self.mid + 1, self.r)))
            .as_mut()
    }

    fn left_mut(&mut self) -> &mut Node {
        self.left
            .get_or_insert_with(|| Box::new(Node::new(self.l, self.mid)))
            .as_mut()
    }
}
```

## Complexity

- Time complexity: O(nlogN) for each query or update operation.
- Space complexity: O(nlogN) for the segment tree.
