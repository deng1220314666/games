# 部署手册

- 前端(Telegram Mini App / H5):`https://tg.ttgame.fun`
- 后端 API:`https://tgapi.ttgame.fun`

## 一键部署 / 更新

**一个脚本搞定,首次部署和以后更新都跑它**(幂等):

```bash
# 首次:先把代码放上服务器
sudo git clone -b ttearn https://github.com/deng1220314666/games.git /var/www/ttearn-src

# 之后每次(首次部署、改代码后更新)都只需:
sudo bash /var/www/ttearn-src/deploy/deploy.sh
```

`deploy.sh` 会自动完成:
1. 装缺失依赖(Node 22 / nginx / certbot,已装则跳过,不动其他站点)
2. 拉取 `ttearn` 分支最新代码
3. 构建前端 → 发布到 `/var/www/ttearn`
4. 部署后端 → `/var/www/ttearn-server/server`,保留已有 `.env`(首次自动生成随机 JWT)
5. systemd 常驻后端(服务名 `ttearn-server`,端口 **3001**)
6. 写 nginx 配置(80 + 443)
7. 申请/复用 Let's Encrypt 证书(webroot 方式,兼容 Cloudflare 代理)
8. 自检

脚本顶部可调:域名、后端端口、证书邮箱、`ENABLE_HTTPS`(纯靠 Cloudflare Flexible 时可设 0 只跑 80)。

## 当前线上环境(103.235.73.195)

| 项 | 值 |
|---|---|
| 系统 | Ubuntu 24.04 |
| 前端目录 | `/var/www/ttearn` |
| 后端目录 | `/var/www/ttearn-server/server`,服务 `ttearn-server`,端口 3001 |
| 仓库 | `/var/www/ttearn-src`,分支 `ttearn` |
| HTTPS | 域名走 Cloudflare;源站 Let's Encrypt 证书上 443,自动续期 |
| 注意 | 端口 3000 被同机 ai-project(Next.js)占用,勿动 |

## 常用运维

```bash
systemctl status ttearn-server        # 状态
journalctl -u ttearn-server -f        # 日志
nano /var/www/ttearn-server/server/.env && systemctl restart ttearn-server  # 改配置
```

## 上线前还需补齐(见仓库根 README 第 4 节)

1. 后端 `.env`:`TELEGRAM_BOT_TOKEN`(登录鉴权)、`TON_WALLET_MNEMONIC`(打款)、`TONCENTER_API_KEY`
2. `src/services/referral.js` 的 `TG_BOT`/`TG_APP`(邀请链接)
3. 广告/统计换成自己账号:`src/config/ads.js`、`public/ads.txt`、`src/utils/event.js` 的 `GA_ID`
4. BotFather 把 Mini App URL 设为 `https://tg.ttgame.fun`
5. Cloudflare SSL 模式建议 Full(strict)
