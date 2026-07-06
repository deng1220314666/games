# 部署手册

- 前端(Telegram Mini App / H5):`https://tg.ttgame.fun` — 静态站
- 后端 API:`https://tgapi.ttgame.fun` — Node/Express

## 当前线上部署(103.235.73.195)已完成

| 项 | 值 |
|---|---|
| 服务器 | Ubuntu 24.04 |
| 前端目录 | `/var/www/ttearn`(nginx 静态) |
| 后端目录 | `/var/www/ttearn-server/server`,systemd 服务 `ttearn-server` |
| 后端端口 | **3001**(3000 被同机的 ai-project/Next.js 占用) |
| 仓库 | `/var/www/ttearn-src`,分支 `ttearn` |
| HTTPS | 域名走 **Cloudflare 代理**;源站用 Let's Encrypt 证书(webroot `/var/www/certbot`)监听 443,自动续期 |
| 后端 .env | 已生成,`JWT_SECRET` 随机;`TELEGRAM_BOT_TOKEN`/`TON_WALLET_MNEMONIC` 待填 |

### 日常更新发布
```bash
sudo bash /var/www/ttearn-src/deploy/redeploy.sh
```
拉取 `ttearn` 分支 → 重新构建前端 → 更新后端(保留 .env)→ 重启服务。

### 常用运维
```bash
systemctl status ttearn-server         # 后端状态
journalctl -u ttearn-server -f         # 后端日志
nano /var/www/ttearn-server/server/.env && systemctl restart ttearn-server  # 改配置
```

---

## 待你补齐(功能才完整)
1. **Telegram Bot**:BotFather 建 bot → 拿 token 填进后端 `.env` 的 `TELEGRAM_BOT_TOKEN`(不填则 initData 登录被跳过、不可信)→ `/newapp` 把 Mini App URL 设为 `https://tg.ttgame.fun`。
2. **bot 名回填**:`src/services/referral.js` 的 `TG_BOT`/`TG_APP`,改完 `redeploy.sh`。
3. **TON 打款**:`.env` 填 `TON_WALLET_MNEMONIC`(独立热钱包)+ `TONCENTER_API_KEY`,并按 `server/src/lib/ton.js` 的 TODO 装 `@ton/ton`。
4. **广告/统计换成你的账号**:`src/config/ads.js`、`public/ads.txt`、`src/utils/event.js` 的 `GA_ID`。
5. **Cloudflare**:SSL/TLS 模式建议 Full(strict);可开 Always Use HTTPS。
6. **安全**:root 密码已在对话明文出现,尽快改密码或换密钥登录。

## 全新服务器初始化(setup.sh)
本仓库还带 `deploy/setup.sh`,用于一台干净服务器从零装 Node/nginx/certbot 并部署。当前这台已手工部署完成,日常用 `redeploy.sh` 即可。
