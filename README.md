# 梁若水 Liang Jo-shui

个人大模型学习主页，发布于 https://leonwater1.github.io/ 。

纯静态 HTML / CSS / JavaScript，不需要安装依赖或构建。沿用仓库现有 GitHub Pages 发布设置。

## 更新

- `index.html`：简介、联系方式与实践记录。
- `data.js`：`topics` 为学习地图，`notes` 为手记。每篇手记需要唯一 `slug`；正文使用可信的作者 HTML。
- `app.js`：搜索、分类、阅读弹窗、主题和移动目录。
- `style.css`：配色与响应式布局。
- `assets/`：两张使用内置 imagegen 制作并压缩为 WebP 的概念配图。

当前三篇文章均标记为示例。换成真实内容时，请同步调整 `index.html` 和 `app.js` 中的示例提示。

本地预览：`python -m http.server 4173`，然后打开 http://localhost:4173 。

语法检查：`node --check app.js` 和 `node --check data.js`。

文章链接使用 `#note/slug`，无需服务器路由。保留了旧页面的 `#zh` 和 `#en` 简介锚点。
