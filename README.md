# 梁若水 / Liang Jo-shui

个人主页与博客：https://leonwater1.github.io/

基于 Cyril-Fan/Cyril-Fan.github.io 的 Astro 源码扩展，保留 Axi 风格、既有主要路由和双语入口。代码来源和许可见 LICENSE 与 THEME-NOTICE.md。

## 本地开发

需要 Node.js 24。执行 `npm ci`，将 `.env.example` 复制为 `.env` 并填写自己的 Supabase URL 和 publishable 公钥，再运行 `npm run dev`。

`npm test` 检查交互与内容逻辑；`npm run test:database` 在本地 PGlite 中检查数据库权限；`npm run test:content` 使用临时内容验证 Markdown/MDX 和双语阅读链路；`npm run build` 生成静态网站。

## 内容与发布

- `src/data/profile.json`：中英文个人资料。
- `src/data/academic.json`：关注方向与未来的项目、文章接口，目前没有虚构成果。
- `src/content/`：文章与合集；当前为空。
- `public/links.json`：友链与 RSS 订阅。
- `/admin`、`/en/admin`：站长内容后台，需要经过邮箱验证并获授管理员权限。

提交到 main 后，由 GitHub Actions 构建并发布到 GitHub Pages。每小时尝试更新友链 RSS 和 GitHub 贡献图。贡献数据由 GitHub 官方 API 提供，动画由固定版本 Platane/snk 生成；浏览器只读取本站完整快照。

前端仅使用 `PUBLIC_SUPABASE_URL` 和 `PUBLIC_SUPABASE_ANON_KEY` 两个公开变量。数据库密码、SMTP 授权码、service_role 和 CMS_GITHUB_TOKEN 不得写入源码或前端环境变量。

后台发布令牌仅需要本仓库 Contents 读写权限，保存在 Supabase Edge Function Secrets。内容接口限制为资料、文章、友链及媒体路径，不允许修改代码或工作流。
