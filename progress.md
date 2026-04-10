# Progress Log

## 2026-04-10 — 修复 URL 中 token 明文暴露问题

### 分支

`feat/remove-token-from-url`

### 问题描述

用户通过 GitHub OAuth 登录后，浏览器地址栏中会显示完整的认证 token：

```text
localhost:9000/?token=user_72119a15-efe0-4e31-b9b1-da78116a104e&provider=github&expiresAt=1775923133968#/dashboard
```

token 明文暴露在 URL 中，存在安全隐患（截图、浏览器历史记录、服务器日志等均可泄露）。

### 根因分析

完整的认证流程如下：

1. `LoginPage.vue:84` 构造回调地址：

   ```text
   frontendRedirectUrl = http://localhost:9000/#/auth/callback
   ```

2. 后端 `routes/auth.js` 中的 `addQueryParams` 使用 `new URL()` 处理该地址，将 token 作为 query 参数附加，由于 `new URL()` 会将 query 插入到 hash 之前，最终生成：

   ```text
   http://localhost:9000/?token=...&provider=github&expiresAt=...#/auth/callback
   ```

3. `AuthCallback.vue` 通过 `window.location.search` 读取 token、验证身份、存入 localStorage，然后调用 `router.replace('/dashboard')`。

4. `router.replace` 只修改了 hash（`#/auth/callback` → `#/dashboard`），但原 URL 中的 `?token=...` query 参数未被清除，最终残留在地址栏中。

### 修复方案

**修改文件：** `src/pages/AuthCallback.vue`

在读取 token 之后、发起任何网络请求之前，立即调用 `history.replaceState` 清理 URL：

```javascript
const params = new URLSearchParams(window.location.search)
const token = params.get('token')

// Remove token from URL immediately to prevent it from being visible or stored in browser history
window.history.replaceState({}, document.title, window.location.pathname + window.location.hash)
```

- `window.location.pathname` 保留路径 `/`
- `window.location.hash` 保留 hash 路由（`#/auth/callback`），Vue Router 继续正常工作
- `?token=...&provider=...&expiresAt=...` 被丢弃

无论后续认证成功还是失败，token 都不会残留在 URL 或浏览器历史记录中。
