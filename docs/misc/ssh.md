---
date: 2023-12-06 09:43:00
tags:
  - Misc
  - ssh
---

# ssh configuration

## 保持连接(server 端)

```sh
vim /etc/ssh/sshd_config
```

写入配置(保持 `120s * 60 = 2h`)

```
TCPKeepAlive yes
ClientAliveInterval 120
ClientAliveCountMax 60
```

重启

```sh
systemctl restart sshd
```
