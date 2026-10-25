# 本站后台配置

独立项目：`vmrfkvjmvwpnnvyzgnrg`。本仓库不包含任何服务端密钥。

数据库迁移已经部署，保留私有评论表、已验证邮箱与管理员权限检查、头像存储策略及匿名页面访问量接口。历史数据库 CMS 已在空数据状态下移除；内容使用 GitHub 文件后台。

Edge Function：`content-github`。CORS 只允许 `https://leonwater1.github.io`。未登录、普通账户和其他来源不能使用发布接口。

QQ SMTP 通过 Supabase Auth 发信。站点 URL 为 `https://leonwater1.github.io`，确认回调为 `/auth/confirm` 和 `/en/auth/confirm`。确认及重设密码模板使用 TokenHash，由用户点击确认后验证。

管理员开通：站长先在本站用 `l3onwat3r@gmail.com` 注册并验证邮箱。管理员授权必须同时核对 auth.users 中的邮箱、用户 ID 和 email_confirmed_at，再将该用户 ID 加入 comment_private.admins。不要对未验证账户授予权限。

网页内容发布需要单独的 GitHub fine-grained token，仅选择 LeonWater1.github.io 仓库、Contents 读写权限，保存为 Edge Function Secret `CMS_GITHUB_TOKEN`。令牌过期后在 Supabase Secrets 中更换，不要提交到 GitHub。

本地安全测试只能运行 `npm run test:database`。禁止将 tests/database 的模拟 Auth/Storage schema 部署到生产项目。
