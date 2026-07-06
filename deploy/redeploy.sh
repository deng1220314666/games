#!/usr/bin/env bash
# 日常更新发布(代码改动后重新上线)。在服务器执行:sudo bash /var/www/ttearn-src/deploy/redeploy.sh
# 会保留后端 .env(密钥不动)。
set -euo pipefail

SRC=/var/www/ttearn-src              # 仓库
WEB=/var/www/ttearn                  # 前端静态目录
API=/var/www/ttearn-server/server    # 后端目录
BRANCH=ttearn

echo ">> 拉取最新代码($BRANCH)"
cd "$SRC"
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

echo ">> 构建前端"
npm install --no-audit --no-fund
npm run build
mkdir -p "$WEB"
cp -r dist/. "$WEB/"

echo ">> 更新后端代码(保留 .env)"
mkdir -p "$API/src"
cp -r "$SRC/server/src/." "$API/src/"
cp "$SRC/server/package.json" "$API/"
cd "$API"
npm install --omit=dev --no-audit --no-fund
systemctl restart ttearn-server
sleep 2
echo ">> 状态:$(systemctl is-active ttearn-server)"
curl -s http://127.0.0.1:3001/health && echo
echo ">> 完成"
