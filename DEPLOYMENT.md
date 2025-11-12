# 部署指南

本项目支持多种部署方式，推荐使用 Vercel 或 Netlify 进行部署。

---

## 方式 1：Vercel 部署（推荐）

### 步骤

1. **安装 Vercel CLI**（可选）
   ```bash
   npm install -g vercel
   ```

2. **通过 GitHub 部署**
   - 访问 [Vercel](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - Vercel 会自动检测 Vite 项目并配置构建设置
   - 点击 "Deploy"

3. **通过 CLI 部署**
   ```bash
   # 登录 Vercel
   vercel login
   
   # 部署到生产环境
   vercel --prod
   ```

### 配置

项目已包含 `vercel.json` 配置文件，包含：
- SPA 路由重写规则
- 静态资源缓存策略
- 构建命令配置

---

## 方式 2：Netlify 部署

### 步骤

1. **通过 GitHub 部署**
   - 访问 [Netlify](https://netlify.com)
   - 使用 GitHub 账号登录
   - 点击 "New site from Git"
   - 选择你的 GitHub 仓库
   - 构建设置会自动填充：
     - Build command: `npm run build`
     - Publish directory: `dist`
   - 点击 "Deploy site"

2. **通过 CLI 部署**
   ```bash
   # 安装 Netlify CLI
   npm install -g netlify-cli
   
   # 登录 Netlify
   netlify login
   
   # 部署
   netlify deploy --prod
   ```

### 配置

项目已包含 `netlify.toml` 配置文件，包含：
- 构建命令和输出目录
- SPA 路由重定向规则
- 静态资源缓存策略

---

## 方式 3：GitHub Pages 部署

### 步骤

1. **修改 `vite.config.ts`**
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/', // 替换为你的仓库名
     // ... 其他配置
   })
   ```

2. **创建 GitHub Actions 工作流**
   
   创建 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm install
           
         - name: Build
           run: npm run build
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **启用 GitHub Pages**
   - 进入仓库 Settings > Pages
   - Source 选择 "gh-pages" 分支
   - 保存设置

---

## 方式 4：自托管部署

### 使用 Docker

1. **创建 Dockerfile**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **创建 nginx.conf**
   ```nginx
   server {
     listen 80;
     server_name localhost;
     root /usr/share/nginx/html;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }

     location /assets/ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

3. **构建和运行**
   ```bash
   # 构建镜像
   docker build -t personal-knowledge-website .
   
   # 运行容器
   docker run -d -p 80:80 personal-knowledge-website
   ```

---

## 环境变量配置

### 开发环境

复制 `.env.example` 为 `.env`：
```bash
cp .env.example .env
```

### 生产环境

在部署平台的环境变量设置中添加：

**Vercel**：
- 进入项目 Settings > Environment Variables
- 添加环境变量

**Netlify**：
- 进入 Site settings > Build & deploy > Environment
- 添加环境变量

---

## 构建优化

### 生产构建

```bash
# 完整构建（包含 lint 检查）
npm run build:prod

# 仅构建
npm run build
```

### 本地预览

```bash
# 预览生产构建
npm run preview

# 或使用自定义端口
npm run serve
```

### 构建分析

查看构建产物大小：
```bash
npm run build
# 查看 dist 目录大小
du -sh dist
```

---

## 性能优化建议

### 1. 启用 CDN

在 Vercel 或 Netlify 上部署时，CDN 会自动启用。

### 2. 启用 Gzip/Brotli 压缩

Vercel 和 Netlify 默认启用压缩，无需额外配置。

### 3. 图片优化

- 使用 WebP 格式
- 使用图片 CDN（如 Cloudinary、imgix）
- 实现懒加载

### 4. 代码分割

项目已配置代码分割：
- React 相关库单独打包
- Markdown 相关库单独打包
- UI 组件库单独打包

---

## 故障排查

### 构建失败

1. **检查 Node.js 版本**
   ```bash
   node --version  # 应该 >= 18
   ```

2. **清理缓存**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **检查 TypeScript 错误**
   ```bash
   npm run lint
   ```

### 部署后页面空白

1. **检查 base 路径配置**
   - Vercel/Netlify：`base: '/'`
   - GitHub Pages：`base: '/repo-name/'`

2. **检查路由配置**
   - 确保 SPA 重写规则正确配置

3. **检查浏览器控制台**
   - 查看是否有资源加载错误

---

## 监控和分析

### Vercel Analytics

在 Vercel 项目设置中启用 Analytics，可以查看：
- 页面访问量
- 性能指标
- 用户地理分布

### Netlify Analytics

在 Netlify 项目设置中启用 Analytics（付费功能）。

### Google Analytics

在 `index.html` 中添加 Google Analytics 代码。

---

## 持续集成/持续部署（CI/CD）

### 自动部署

推送到 `main` 分支时自动部署：

**Vercel**：
- 自动检测 Git 推送
- 自动构建和部署

**Netlify**：
- 自动检测 Git 推送
- 自动构建和部署

### 预览部署

Pull Request 会自动创建预览部署，方便测试。

---

## 域名配置

### Vercel

1. 进入项目 Settings > Domains
2. 添加自定义域名
3. 按照提示配置 DNS 记录

### Netlify

1. 进入 Site settings > Domain management
2. 添加自定义域名
3. 按照提示配置 DNS 记录

---

## 总结

推荐部署方式：
1. **Vercel**（最简单，性能好）
2. **Netlify**（功能丰富）
3. **GitHub Pages**（免费，适合个人项目）
4. **自托管**（完全控制）

选择适合你的部署方式，开始部署吧！🚀
