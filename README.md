# Journey

Journey 是一个以时间线、影像和心愿为主的纪念页面。`/live2d/` 是独立的 AI 形象陪伴子页面：使用已有 Live2D 模型，支持分区触摸、摸头、拉手回弹、拖放茶/礼物、文字聊天、腾讯云语音回复和麦克风转写。

生日入口、进站烟花、蜡烛、生日照片、生日信和相关特效已移除。

## 本地开发

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test:companion
```

Live2D 运行文件放在 Cloudflare R2，不进入 Git。Pages Function 位于 `functions/api/companion/[[path]].js`，服务实现位于 `server/companion.mjs`。生产环境使用 Pages secret 配置 LLM 和腾讯云语音密钥，前端不接触这些密钥。

## Cloudflare 配置

生产 Pages 项目是 `ourjourney`，R2 bucket 是 `journey`。需要配置 `MY_BUCKET`、`AUTH_PASSWORD`、`COMPANION_LLM_API_KEY`、`COMPANION_TENCENT_SECRET_ID` 和 `COMPANION_TENCENT_SECRET_KEY`；公开变量包括 `COMPANION_API_BASE_URL`、`COMPANION_CHAT_MODEL`、`COMPANION_TENCENT_REGION` 和 `COMPANION_ASSET_PREFIX`。模型资源由 R2 配置清单白名单保护，只能通过 `/api/companion/assets/` 读取。

访问站点后，从导航进入“陪伴”；页面复用 Journey 的访问口令。聊天历史默认保存在当前浏览器，语音和聊天请求经 Pages Function 转发到已配置服务。
