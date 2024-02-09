#!/bin/sh
echo "=== Deployment All Start ==="
pnpm build
cd docs/.vitepress/dist
zip -r ../../../qyuzh.zip *
cd ../../..
scp qyuzh.zip root@qyuzh.com:/usr/local/nginx/html
ssh root@qyuzh.com "echo 'unzip...' && cd /usr/local/nginx/html && unzip -oq qyuzh.zip -x 'logo.jpg' '*.webp' && echo 'deploy success'"
echo "===Deployment All finished==="