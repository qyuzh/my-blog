#!/bin/sh
echo "=== Deployment All Start ==="
pnpm build
cd docs/.vitepress/dist
zip -r ../../../qyuzh.zip *
cd ../../..
scp qyuzh.zip qyuzh@qyuzh.com:~/deployment/web_entry/data/blog
ssh qyuzh@qyuzh.com "echo 'unzip...' && cd ~/deployment/web_entry/data/blog && unzip -oq qyuzh.zip -x 'logo.jpg' && echo 'deploy success'"
echo "===Deployment All finished==="
