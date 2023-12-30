---
date: 2023-12-06 09:33:00
tags:
  - Misc
  - Nginx
---

# Install latest nginx with https on ubuntu

## Download

```sh
wget http://nginx.org/download/nginx-1.25.3.tar.gz
tar -zxf nginx-1.25.3.tar.gz
```

## Dependencies

```sh
apt-get install libpcre3 libpcre3-dev zlib1g zlib1g-dev
apt-get install openssl libssl-dev
```

## Configuration before make

```
./configure --prefix=/usr/local/nginx --with-http_ssl_module
```

- `--prefix` represents the dirctory that installed the nginx
- `--with-http_ssl_module` enable https

## make & install

```
make
make install
```

## Configure systemd

```sh
vim /usr/lib/systemd/system/nginx.service
```

```toml
[Unit]
Description=A high performance web server and a reverse proxy server
Documentation=man:nginx(8)
After=network.target nss-lookup.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
TimeoutStopSec=5
KillMode=mixed

[Install]
WantedBy=multi-user.target
```

## nginx conf

```txt
server {
        listen       443 ssl;
        server_name  blog.qyuzh.com;
	    ssl_certificate cert/blog.qyuzh.com.pem;
	    ssl_certificate_key cert/blog.qyuzh.com.key;
	    ssl_session_timeout 5m;
	    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	    ssl_protocols TLSv1.2 TLSv1.3;
	    ssl_prefer_server_ciphers on;


        location / {
            if (!-e $request_filename) {
		        rewrite ^(.*)$ /$1.html break;
	        }
            root   html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        error_page   404  /404.html;
        location = /404.html {
            root   html;
        }
    }
```

`rewrite regex replacement [flag]`

1. `flag=last`, stops processing the current set of `ngx_http_rewrite_module` directives and starts a search for a new location matching the changed URI
2. `flag=break`, stops processing the current set of `ngx_http_rewrite_module` directives as with the break directive;
