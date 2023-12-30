---
title: JavaScript Language Related Algorithms
date: 2022-02-13 19:00:00
description: JavaScript语言相关的各类实现.
tags:
  - JavaScript
---

# JavaScript Language Related Algorithms

## 模拟实现 new 操作符

### Problem Description

模拟实现 JavaScript 中的 new 操作符.

### Solution

```javascript
/**
 * 模拟实现new操作符.
 *
 * fn只能是函数式的, 不能是class式的. 因为class式的, 只能使用new操作符, 不可单独调用.
 *
 * @param {function} fn 函数
 * @param  {...any} args 实例化参数
 * @returns {object} 实例化对象
 */
function myNew(fn, ...args) {
  const obj = {};
  Object.setPrototypeOf(obj, fn.prototype);
  // const obj = Object.create(fn.prototype)
  const res = fn.apply(obj, args);
  return typeof res === 'object' && res !== null ? res : obj;
}
```

## 模拟实现 call/apply 和 bind

### Problem Description

模拟实现 JavaScript 中的 call/apply 和 bind 函数.

- call/apply, 在给定运行时上下文中运行一次函数
- bind, 返回一个新函数, 此函数绑定一个运行时上下文, 并预置一些参数

### Solution

- **call/apply**

```javascript
/**
 * 模拟实现f.call()
 *
 * @param {object} ctx 调用时上下文
 * @param  {...any} args 调用参数
 * @returns 调用结果
 */
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ? Object(ctx) : globalThis;
  ctx.fn = this;
  let res = ctx.fn(...args);
  delete ctx.fn;
  return res;
};

/**
 * 模拟实现f.apply()
 *
 * @param {object} ctx 调用时上下文
 * @param  {array} args 调用参数
 * @returns 调用结果
 */
Function.prototype.myApply = function (ctx, args) {
  ctx = ctx ? Object(ctx) : globalThis;
  ctx.fn = this;
  let res = args ? ctx.fn(...args) : ctx.fn();
  delete ctx.fn;
  return res;
};
```

- **bind**

```javascript
/**
 * 模拟实现f.bind
 *
 * @param {object} ctx 调用时上下文
 * @param  {...any} args 预置参数
 * @returns {function} 已绑定上下文的函数
 */
Function.prototype.myBind = function (ctx, ...args) {
  let fn = this;
  return function (...newArgs) {
    return fn.call(ctx, ...args, ...newArgs);
  };
};
```

## Simulating `instanceof` operator

```js
/**
 * 模拟实现instanceof
 *
 * @param {object} obj 检查对象
 * @param {class|function} fn 构造器
 * @returns {boolean} obj是否是fn的实例
 */
function myInstanceof(obj, fn) {
  let left = obj.__proto__;
  let right = fn.prototype;
  while (true) {
    if (left === null) {
      return false;
    }
    if (left === right) {
      return true;
    }
    left = left.__proto__;
  }
}
```

## Fisher-Yates Shuffle

### Problem Description

- Input: 整数数组. 其元素各不相同.
- Output: 整数数组. 其内容为原素组的某一个排列, 要求数组元素的所有排列被输出的概率相同.

### Ideas

每次从原数组的剩下元素中随机取出一个元素, 然后将其加入新的数组; 重复$n$次(数组长度)即可.

### Proof

每个排列被输出的概率相同 $\iff$ 每个位置出现每个元素的概率相同 $\iff$ 每一次取到每个剩下元素的概率相同.

### Implement

JavaScript 实现如下,

```javascript
function Solution(nums) {
  this._origin = nums;
}
Solution.prototype.reset = function () {
  return this._origin;
};
Solution.prototype.shuffle = function () {
  let nums = [...this._origin];
  let len = nums.length;
  for (let i = 0; i < len; i++) {
    // 从剩下数组中随机取出一个数
    let index = Math.trunc(Math.random() * (len - i)) + i;
    // 把此数放置到数组前面
    [nums[i], nums[index]] = [nums[index], nums[i]];
  }
  return nums;
};
```

### Complexity Analysis

- Time: $O(n)$
- Space: $O(n)$

## 数组扁平化

### Problem Description

给定数组,

```javascript
const arr = [
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
  10,
];
```

设计算法: 扁平化, 去重, 并按递增顺序排列元素组成新素组.

### Solution

Solution 1:

```javascript
/**
 * .flat(Infinity): 扁平化 // ES2019
 * new Set(): 去重
 * .sort((a, b) => a - b): 递增序
 */
let newArr = Array.from(new Set(arr.flat(Infinity)));
newArr.sort((a, b) => a - b);
console.log(newArr);
```

Solution 2:

```javascript
// implement by ourself: reduce + concat + isArray + recursivity
function flatDeep(arr) {
  return Array.isArray(arr)
    ? arr.reduce((acc, val) => acc.concat(flatDeep(val)), [])
    : arr;
}

let newArr = Array.from(new Set(flatDeep(arr)));
newArr.sort((a, b) => a - b);
console.log(newArr);
```

Solution 3:

```javascript
// Use: toString()
arr.toString(); // 1,2,2,3,4,5,5,6,7,8,9,11,12,12,13,14,10

let newArr = arr.toString().split(',');
newArr = newArr.map((x) => parseInt(x, 10)); // .map() returns a new arr

newArr = Array.from(new Set(newArr));
newArr.sort((a, b) => a - b);
console.log(newArr);
```

## Debounce & throttle

### 防抖(debounce)

#### 理解

- 防抖, 防止抖动, 避免把一次事件误认为多次事件.
- 某事件被触发后不立即响应(执行回调)而是 n 毫秒后再响应, 且如果在延时内又被触发, 则重新计时.
- 事件被触发多次, 但只响应最后一次.

```javascript
/**
 * 防抖(debounce): 事件被多次触发, 只响应最后一次
 *
 * @param {function} fn
 * @param {number} delay
 * @returns {function}
 */
function debounce(fn, delay = 200) {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}
```

#### 应用

- 浏览器窗口大小调整. 实际上, 我们只是把窗口大小从一个值调整到另外一个值, 而不是任何中间值, 因此我们只需要响应最终值的事件即可. 但`resize`事件是不断触发的, 此时, 需要防抖.
- 按一个按钮发送 AJAX：给 click 加了 debounce 后就算用户不停地点这个按钮, 也只会最终发送一次, 如果是 throttle 就会间隔发送几次.

### 节流(throttle)

#### 理解

- 节流, 控制水的流量, 在这里指控制事件发生的频率.
- 若某一事件在一段时间内被触发多次, 则只响应一次(执行回调一次).
- 事件被触发多次, 每隔一段时间响应一次.

```javascript
/**
 * 节流(throttle), 事件被多次触发, 每隔一段时间响应一次
 *
 * 时间段的开头响应
 * @param {function} fn
 * @param {number} interval
 * @returns {function}
 */
function throttle(fn, interval = 200) {
  let previous = 0;
  return function () {
    let now = Date.now();
    if (now - previous >= interval) {
      fn.apply(this, arguments);
      previous = now;
    }
  };
}

/**
 * 节流(throttle), 事件被多次触发, 每隔一段时间响应一次
 *
 * 时间段的结尾响应
 * @param {function} fn
 * @param {number} interval
 * @returns {function}
 */
function throttle2(fn, interval = 200) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        fn.apply(this, arguments);
      }, interval);
    }
  };
}
```

#### 应用

- 射击游戏的 mousedown/keydown 事件(单位时间只能发射一颗子弹).
- 监听滚动事件判断是否到页面底部自动加载更多: 给 scroll 加了 debounce 后, 只有用户停止滚动后, 才会判断是否到了页面底部; 如果是 throttle 的话, 只要页面滚动就会间隔一段时间判断一次.

## DeepClone

```js
/**
 * 基于JSON相关API实现深度克隆.
 *
 * @param {object} obj 被克隆对象
 * @returns {object} 一个新对象
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 基于递归实现深度克隆
 *
 * @param {object} obj 被克隆对象
 * @returns {object} 一个新对象
 */
function deepClone2(obj) {
  let newObj = Array.isArray(obj) ? [] : {};
  for (let key of Object.keys(obj)) {
    newObj[key] =
      typeof obj[key] === 'object' ? deepClone2(obj[key]) : obj[key];
  }
  return newObj;
}
```

## Curring

```js
/**
 * Currify一个函数
 *
 * @param {function} fn 需要被currify的函数
 * @param  {...any} args 预置参数
 * @returns {function} 函数
 */
function curry(fn, ...args) {
  return function () {
    const newArgs = args.concat([].slice.call(arguments));
    if (newArgs.length >= fn.length) {
      return fn.apply(this, newArgs);
    } else {
      return curry(fn, ...newArgs);
    }
  };
}

// 测试

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1, 2, 3) === curriedAdd(1)(2)(3)); // => true
```

---

Reference

1. https://github.com/sisterAn/JavaScript-Algorithms
