---
tags:
  - Misc
  - Makefile
---

# A simple Makefile Tutorial

Suppose we have three files:

```c
// hellomake.h
#include <hellomake.h>

int main() {
  // call a function in another file
  myPrintHelloMake();

  return(0);
}
```

```c
// hellomake.h
void myPrintHelloMake(void);
```

```c
// hellofunc.c
#include <stdio.h>
#include <hellomake.h>

void myPrintHelloMake(void) {

  printf("Hello makefiles!\n");

  return;
}
```

## Makefile1

```makefile
hellomake: hellomake.c hellofunc.c
    gcc -o hellomake hellomake.c hellofunc.c -I.
```

1. `make` with no arguments executes the first command in the file.
2. the list of files after `:` make `make` knows that the rule `hellomake` needs to be executed if any of those files change.
