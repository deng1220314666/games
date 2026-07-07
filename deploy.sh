#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# 一键部署(在 Windows 的 Git Bash 里跑,或用 deploy.ps1 包装)。
#
#   ./deploy.sh
#
# 用专用 SSH 密钥(~/.ssh/ttgame_deploy)免密登录:打包本地源码(排除
# node_modules / dist / .git / 密钥 .env),上传到服务器,再在服务器上跑
# scripts/server-deploy.sh(解包 -> 构建 -> 后端 -> nginx/证书 -> 重启 -> 健康检查)。
#
# 换密钥:  DEPLOY_KEY=/path/to/key ./deploy.sh
# ---------------------------------------------------------------------------
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER="root@103.235.73.195"
KEY="${DEPLOY_KEY:-$HOME/.ssh/ttgame_deploy}"
LOCAL_TARBALL="/tmp/ttearn-deploy.tar.gz"
REMOTE_TARBALL="/tmp/ttearn-deploy.tar.gz"
SSH_OPTS=(-i "$KEY" -o BatchMode=yes -o StrictHostKeyChecking=accept-new)

[ -f "$KEY" ] || { echo "SSH 密钥不存在: $KEY" >&2; exit 1; }

echo "==> 打包源码..."
# 注意:保留 .env.production(前端构建需要的公开 API 地址,无密钥);排除后端 server/.env
tar -C "$PROJECT_ROOT" \
  --exclude='./node_modules' --exclude='./dist' --exclude='./.git' \
  --exclude='./.idea' --exclude='./server/node_modules' --exclude='./server/data' \
  --exclude='./admin-web/node_modules' --exclude='./admin-web/dist' \
  --exclude='./.env' --exclude='./.env.local' --exclude='./server/.env' \
  --exclude='./.deploy.local' \
  -czf "$LOCAL_TARBALL" .

echo "==> 上传 ($(du -h "$LOCAL_TARBALL" | cut -f1))..."
scp "${SSH_OPTS[@]}" "$LOCAL_TARBALL" "$SERVER:$REMOTE_TARBALL"

echo "==> 服务器部署..."
# 直接把 server-deploy.sh 通过 stdin 送过去执行,不依赖服务器上已有该文件
ssh "${SSH_OPTS[@]}" "$SERVER" "bash -s -- $REMOTE_TARBALL" < "$PROJECT_ROOT/scripts/server-deploy.sh"

echo ""
echo "==> 完成。前端 https://tg.ttgame.fun   API https://tgapi.ttgame.fun"
