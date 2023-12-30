---
date: 2023-12-06 15:51:00
tags:
  - Misc
  - Linux
  - epoll
---

# epoll example on Linux

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/epoll.h>
#include <sys/socket.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>

#define EPOLL_INSTANCE_SIZE 256
#define SERVER_ADDR "0.0.0.0"
#define SERVER_PORT 30000
#define MAX_CONNETIONS 20
#define MAX_EVENTS 20
#define BUF_SIZE 1024

void setnonblocking(int fd) {
    int fl = fcntl(fd, F_GETFL);
    if (fl < 0) {
        perror("fctn(F_GETFL) error");
        exit(1);
    }
    fl |= O_NONBLOCK;
    if (fcntl(fd, F_SETFL, fl) < 0) {
        perror("fcntl(F_SETFL)");
        exit(1);
    }
}

int main(int argc, char const *argv[]) {
    int epfd = epoll_create(EPOLL_INSTANCE_SIZE);  // epfd to an epoll instance

    int listen_fd = socket(AF_INET, SOCK_STREAM, 0);  // IPv4 TCP Socket
    setnonblocking(listen_fd);

    struct epoll_event ev;
    ev.data.fd = listen_fd;
    ev.events = EPOLLIN | EPOLLET;  // read and edge-triggered

    // add listen_fd to epfd with ev is interested
    epoll_ctl(epfd, EPOLL_CTL_ADD, listen_fd, &ev);

    // construct server addr
    struct sockaddr_in server_addr;
    bzero(&server_addr, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    char *addr = SERVER_ADDR;
    inet_aton(addr, &(server_addr.sin_addr));
    server_addr.sin_port = htons(SERVER_PORT);

    bind(listen_fd, (struct sockaddr *)&server_addr, sizeof(server_addr));
    listen(listen_fd, MAX_CONNETIONS);

    struct epoll_event events[MAX_EVENTS];
    struct sockaddr_in client_addr;
    int i;
    char buf[BUF_SIZE];
    int n;
    for (;;) {
        int nfds = epoll_wait(epfd, events, 20, 5000);
        for (i = 0; i < nfds; ++i) {
            if (events[i].data.fd == listen_fd) {
                socklen_t addr_len;
                int fd = accept(listen_fd, (struct sockaddr *)&client_addr,
                                &addr_len);
                if (fd < 0) {
                    perror("accept: fd < 0");
                    exit(1);
                }

                setnonblocking(fd);

                char *s = inet_ntoa(client_addr.sin_addr);
                printf("accept connection from %s:%d\n", s,
                       ntohs(client_addr.sin_port));

                ev.data.fd = fd;
                ev.events = EPOLLIN | EPOLLET;
                epoll_ctl(epfd, EPOLL_CTL_ADD, fd, &ev);
            } else if (events[i].events & EPOLLIN) {
                int fd = events[i].data.fd;
                if (fd < 0) continue;
                n = read(fd, buf, BUF_SIZE);
                if (n < 0) {
                    if (errno == ECONNRESET) {
                        close(fd);
                        events[i].data.fd = -1;
                    } else {
                        printf("read error\n");
                    }
                } else if (n == 0) {
                    close(fd);
                    events[i].data.fd = -1;
                    printf("peer exit\n");
                } else {
                    printf("received data: %s", buf);
                }

                ev.data.fd = fd;
                ev.events = EPOLLOUT | EPOLLET;
                epoll_ctl(epfd, EPOLL_CTL_MOD, fd, &ev);
            } else if (events[i].events & EPOLLOUT) {
                int fd = events[i].data.fd;

                write(fd, buf, n);
                printf("write data:    %s", buf);

                ev.data.fd = fd;
                ev.events = EPOLLIN | EPOLLET;
                epoll_ctl(epfd, EPOLL_CTL_MOD, fd, &ev);
            }
        }
    }

    return 0;
}
```
