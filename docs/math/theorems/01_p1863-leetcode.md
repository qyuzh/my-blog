---
tags:
  - Theorem
---

# P1863, leetcode

## **Theorem 1**

Let $A$ be a binary sequence of length $n$ consisting of 0s and 1s.

1. If $A$ contains at least one 1, then the sum of XOR sums of all subsets of $A$ is $2^{n-1}$.
2. If $A$ contains only 0s, then the sum is 0.

---

## **Proof**

### **Definitions and Setup**

- **XOR sum of a subset**: The result of applying XOR ($\oplus$) to all elements in the subset (equivalent to parity of 1s count).
- **Objective**: Count the number of subsets with XOR sum = 1 (i.e., subsets with an odd number of 1s).

---

### **Case 1: All elements are 0**

- Every subset has XOR sum 0.
- **Total sum**: $0$.

---

### **Case 2: At least one 1 is present**

Let $m \geq 1$ be the count of 1s in $A$, and $n-m$ be the count of 0s.

1. **Step 1**: Choose an odd number of 1s from the $m$ available.
   - By the binomial theorem:
     $$
     \sum_{k \text{ odd}} \binom{m}{k} = 2^{m-1}.
     $$
     *Derivation*:
     From
     $$
     (1+1)^m = \sum_{k=0}^m \binom{m}{k}
     $$
     and
     $$
     (1-1)^m = \sum_{k=0}^m \binom{m}{k}(-1)^k
     $$
     , subtract to get:
     $$
     2^m = 2 \sum_{k \text{ odd}} \binom{m}{k} \implies \sum_{k \text{ odd}} \binom{m}{k} = 2^{m-1}.
     $$

2. **Step 2**: Freely include any of the $n-m$ 0s (they do not affect the XOR sum).
   - Choices for 0s: $2^{n-m}$.

3. **Total subsets with XOR sum 1**:
   $$
   2^{m-1} \times 2^{n-m} = 2^{n-1}.
   $$

---

## **Example Verification**

- For $m = 3$ 1s:
  - Subsets with odd 1s: $\binom{3}{1} + \binom{3}{3} = 4 = 2^{3-1}$
- For $n = 5$ (with 2 extra 0s):
  - Total valid subsets: $4 \times 2^2 = 16 = 2^{5-1}$

---

## **Conclusion**

The proof leverages the binomial theorem to count parity-constrained subsets, establishing that the XOR sum over all subsets is $2^{n-1}$ when 1s exist, and 0 otherwise.
