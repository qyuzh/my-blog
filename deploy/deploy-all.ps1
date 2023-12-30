echo "=== Deployment All Start ==="
pnpm build
cd docs/.vitepress/dist
rm ../../../releases/qyuzh.zip
7z a ../../../releases/qyuzh.zip *
cd ../../..
scp releases/qyuzh.zip root@qyuzh.com:/usr/local/nginx/html
ssh root@qyuzh.com "echo 'unzip...' && cd /usr/local/nginx/html && unzip -oq qyuzh.zip -x 'logo.jpg' '*.webp'"
echo "===Deployment All finished==="