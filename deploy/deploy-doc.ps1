echo "=== Deployment Doc Start ==="
pnpm build
cd docs/.vitepress/dist
7z a ../../../releases/qyuzh.zip *
cd ../../..
scp releases/qyuzh.zip root@qyuzh.com:html
ssh root@qyuzh.com "echo 'unzip...' && cd /root/html && unzip -oq qyuzh.zip -x '*/chunks/*' '*.png' '*.jpg'"
echo "===Deployment Doc finished==="