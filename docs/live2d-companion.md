# Live2D 陪伴子页面

入口为 `/live2d/`。Vite 使用多页面构建，生产文件位于 `dist/live2d/`。

Pages Function 提供：

- `GET /api/companion/state`：模型配置、能力和触摸区域；不返回密钥。
- `POST /api/companion/session`：用 Journey 访问口令建立 8 小时 HttpOnly 会话。
- `POST /api/companion/chat`：通过 Apexin 的 OpenAI 兼容接口流式返回 NDJSON。
- `POST /api/companion/speech`：调用腾讯云男声，返回短期使用的 Base64 音频。
- `POST /api/companion/transcribe`：校验 16 kHz 单声道 PCM WAV 后调用腾讯云识别。
- `GET /api/companion/assets/*`：只允许配置清单中的 Live2D 模型资源。

模型资源前缀由 `COMPANION_ASSET_PREFIX` 指定。R2 配置清单记录模型文件和由真实图层 bbox 推导出的头、脸、肩、双手触摸区域。前端动作调度器复用现有模型参数，动作即时执行，不等待聊天模型。

聊天请求携带最近浏览器历史和白名单互动 ID。后端只把已知 ID 转成固定中文描述，过滤客户端伪造的系统消息；聊天历史不落入 R2。

生日相关入口、烟花、生日照片、蛋糕、蜡烛、生日信和 `birthday` URL 触发器已删除。`rg -n -i 'birthday|生日|firework|confetti|candle|cake' index.html src public` 应为空。
