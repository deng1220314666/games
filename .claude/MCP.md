# 本项目使用的 MCP 服务器

配置在仓库根 `.mcp.json`。首次进入会提示批准使用(项目级 MCP 需确认)。

## 已启用(无需密钥)

### 1. `playwright` — 浏览器自动化 / UI 验证
- 用途:驱动移动端 H5 与 Telegram 小程序页面,验证赚币/签到/提现流程、截图、点按、检查激励广告发币是否生效。网赚项目重交互,这是最常用的一个。
- 命令:`npx -y @playwright/mcp@latest`
- 首次会自动装浏览器内核。

### 2. `context7` — 实时库文档
- 用途:拉取 **TON Connect、Telegram WebApp SDK、Vue 3、vue-i18n、Tailwind** 等库的最新文档与用法,避免用过期 API。
- 命令:`npx -y @upstash/context7-mcp`
- 免费可用;如需更高频率,去 upstash 申请 key 后加环境变量 `CONTEXT7_API_KEY`。

## 可选(需密钥,按需自行加入 `.mcp.json`)

### TON 链上数据(toncenter)
查钱包余额、交易、校验提现打款状态时使用。到 https://toncenter.com 申请 API key,然后接一个 HTTP/fetch 型 MCP,或直接在后端调 toncenter API。示例(fetch MCP,需本机有 uv):

```jsonc
"ton-fetch": {
  "command": "uvx",
  "args": ["mcp-server-fetch"]
  // 之后在对话里 fetch: https://toncenter.com/api/v3/... ?api_key=YOUR_KEY
}
```

真实 TON 打款、initData 校验、账本以**后端**为准,MCP 仅用于开发期查询/调试,勿在其中放私钥。

### 其他支付渠道(预留)
卡 / USDT 等后续对接时,再按对应服务商补充 MCP 或直接后端集成。当前仅 TON 优先。
