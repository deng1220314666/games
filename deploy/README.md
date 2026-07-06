# 部署手册

- 前端(Telegram Mini App / H5):`https://tg.ttgame.fun` — 静态站
- 后端 API:`https://tgapi.ttgame.fun` — Node/Express(反代 :3000)

前端已按这两个域名配置好并打包(`dist/`)。下面在**服务器上**执行。

## 0. 前置:DNS
到域名解析里加两条 A 记录,都指向服务器公网 IP:
```
tg.ttgame.fun     A   <服务器IP>
tgapi.ttgame.fun  A   <服务器IP>
```
解析生效后再申请证书,否则 certbot 会失败。

## 1. 把代码放到服务器
任选其一:
```bash
# a) git(推荐)
sudo mkdir -p /var/www/ttearn-src && cd /var/www/ttearn-src
git clone <你的仓库地址> .
# b) 或从本地上传(在你本机执行)
#   scp -r ./ user@server:/var/www/ttearn-src
```

## 2. 一键部署
```bash
cd /var/www/ttearn-src
sudo bash deploy/setup.sh
```
脚本会:装 Node20/nginx/certbot → 构建前端到 `/var/www/ttearn` → 部署后端到 `/var/www/ttearn-server` 并生成 `.env`(自动填 JWT_SECRET)→ systemd 常驻 → 配 nginx → 申请 HTTPS。

## 3. 填后端密钥(必须)
```bash
sudo nano /var/www/ttearn-server/server/.env
```
补齐:
- `TELEGRAM_BOT_TOKEN`(BotFather 给的,校验登录用)
- `TON_WALLET_MNEMONIC`(独立热钱包助记词,打款用;暂不填则提现只落 pending)
- `TONCENTER_API_KEY`(查链上余额)
改完重启:`sudo systemctl restart ttearn-server`

## 4. Telegram BotFather
1. `/newbot` 建 bot(拿到 `TELEGRAM_BOT_TOKEN` 回填第 3 步)。
2. `/newapp` 或 Bot Settings → Web App,把 Mini App URL 设为 `https://tg.ttgame.fun`。
3. 代码里把 bot 名回填:`src/services/referral.js` 的 `TG_BOT`/`TG_APP`(邀请链接用),改完重新 `npm run build` 并同步 `dist/`。

## 5. 自检
```bash
curl https://tgapi.ttgame.fun/health          # {"ok":true,...}
```
浏览器打开:
- `https://tg.ttgame.fun` 能进,登录/签到/看广告发币正常
- `https://tg.ttgame.fun/tonconnect-manifest.json` 能访问、是 JSON

## 更新发布(以后改代码后)
```bash
cd /var/www/ttearn-src && git pull
sudo bash deploy/setup.sh    # 会重新构建+同步+重启
```

## 还没换成你自己账号的(上线前务必处理,见仓库 README 第 4 节)
- 广告:`src/config/ads.js`(Adsterra/OnClick)、`public/ads.txt`
- 统计:`src/utils/event.js` 的 `GA_ID`
- 这些改完要重新 build。
