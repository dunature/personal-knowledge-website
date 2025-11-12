# GitHub 仓库创建指南

完整的 GitHub 仓库创建和代码推送步骤。

---

## 📋 前提条件

- 已安装 Git
- 拥有 GitHub 账号
- 已配置 Git 用户信息

### 检查 Git 配置

```bash
# 检查 Git 是否已安装
git --version

# 检查用户配置
git config --global user.name
git config --global user.email
```

### 如果未配置，设置用户信息

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

---

## 🚀 方式 1：通过 GitHub 网页创建（推荐）

### 步骤 1：在 GitHub 创建新仓库

1. **访问 GitHub**
   - 打开 https://github.com
   - 登录你的账号

2. **创建新仓库**
   - 点击右上角的 "+" 按钮
   - 选择 "New repository"

3. **填写仓库信息**
   - **Repository name**: `personal-knowledge-website`（或你喜欢的名字）
   - **Description**: `个人知识管理系统 - 记录学习笔记和技术文章`
   - **Visibility**: 
     - ✅ Public（公开，推荐）
     - ⬜ Private（私有）
   - **不要勾选**以下选项（因为本地已有代码）：
     - ⬜ Add a README file
     - ⬜ Add .gitignore
     - ⬜ Choose a license

4. **点击 "Create repository"**

### 步骤 2：初始化本地 Git 仓库

在项目目录中执行：

```bash
# 进入项目目录
cd personal-knowledge-website

# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "feat: initial commit - personal knowledge management system"
```

### 步骤 3：连接远程仓库并推送

GitHub 会显示推送命令，复制并执行：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/personal-knowledge-website.git

# 推送代码到 main 分支
git branch -M main
git push -u origin main
```

**示例**：
```bash
# 如果你的用户名是 johndoe
git remote add origin https://github.com/johndoe/personal-knowledge-website.git
git branch -M main
git push -u origin main
```

### 步骤 4：输入 GitHub 凭证

首次推送时，Git 会要求输入凭证：

**选项 A：使用 Personal Access Token（推荐）**

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" > "Generate new token (classic)"
3. 设置 Token 名称：`personal-knowledge-website`
4. 选择权限：勾选 `repo`（完整仓库访问权限）
5. 点击 "Generate token"
6. **复制生成的 token**（只显示一次！）
7. 在 Git 推送时：
   - Username: 你的 GitHub 用户名
   - Password: 粘贴刚才复制的 token

**选项 B：使用 SSH（高级用户）**

如果你已配置 SSH 密钥，使用 SSH URL：
```bash
git remote add origin git@github.com:YOUR_USERNAME/personal-knowledge-website.git
```

---

## 🔄 方式 2：通过 GitHub CLI（命令行）

### 安装 GitHub CLI

**macOS**:
```bash
brew install gh
```

**Windows**:
```bash
winget install --id GitHub.cli
```

### 创建仓库并推送

```bash
# 登录 GitHub
gh auth login

# 进入项目目录
cd personal-knowledge-website

# 初始化 Git（如果还没有）
git init
git add .
git commit -m "feat: initial commit"

# 创建 GitHub 仓库并推送
gh repo create personal-knowledge-website --public --source=. --push

# 或者创建私有仓库
gh repo create personal-knowledge-website --private --source=. --push
```

---

## ✅ 验证推送成功

### 检查远程仓库

```bash
# 查看远程仓库配置
git remote -v

# 应该显示：
# origin  https://github.com/YOUR_USERNAME/personal-knowledge-website.git (fetch)
# origin  https://github.com/YOUR_USERNAME/personal-knowledge-website.git (push)
```

### 访问 GitHub 仓库

打开浏览器，访问：
```
https://github.com/YOUR_USERNAME/personal-knowledge-website
```

你应该能看到所有代码文件。

---

## 📝 创建 .gitignore 文件

在推送前，确保有正确的 `.gitignore` 文件：

```bash
# 创建 .gitignore
cat > .gitignore << 'EOF'
# 依赖
node_modules/
.pnp
.pnp.js

# 测试
coverage/

# 生产构建
dist/
build/

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# 编辑器
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# 临时文件
*.log
.cache/
.temp/
.tmp/
EOF
```

---

## 🔐 保护敏感信息

### 检查是否有敏感信息

```bash
# 搜索可能的敏感信息
grep -r "password" .
grep -r "api_key" .
grep -r "secret" .
```

### 如果发现敏感信息

1. **从代码中移除**
2. **添加到 .env 文件**
3. **确保 .env 在 .gitignore 中**
4. **使用 .env.example 作为模板**

---

## 🎯 后续操作

### 1. 更新 README

编辑 `README.md`，添加项目说明：

```markdown
# 个人知识管理系统

一个用于记录学习笔记和技术文章的个人网站。

## 功能特点

- 📚 资源导航：收藏和管理学习资源
- 💬 问答板：记录问题和解决方案
- ✍️ Markdown 编辑：支持富文本编辑
- 🔍 搜索和筛选：快速找到需要的内容

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Marked.js
- Highlight.js

## 快速开始

\`\`\`bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
\`\`\`

## 部署

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解详细部署步骤。

## License

MIT
```

### 2. 添加 License

创建 `LICENSE` 文件（MIT License 示例）：

```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 [你的名字]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

### 3. 提交更新

```bash
git add README.md LICENSE .gitignore
git commit -m "docs: update README and add LICENSE"
git push
```

---

## 🐛 常见问题

### 问题 1：推送被拒绝

**错误信息**：
```
! [rejected]        main -> main (fetch first)
```

**解决方法**：
```bash
# 拉取远程更改
git pull origin main --rebase

# 再次推送
git push origin main
```

### 问题 2：认证失败

**错误信息**：
```
remote: Support for password authentication was removed
```

**解决方法**：
使用 Personal Access Token 而不是密码（见上文）

### 问题 3：文件太大

**错误信息**：
```
remote: error: File is too large
```

**解决方法**：
```bash
# 检查大文件
find . -type f -size +50M

# 添加到 .gitignore
echo "large-file.zip" >> .gitignore

# 从 Git 历史中移除
git rm --cached large-file.zip
git commit -m "chore: remove large file"
```

### 问题 4：忘记添加 .gitignore

**解决方法**：
```bash
# 创建 .gitignore
# （见上文）

# 从 Git 中移除已跟踪的文件
git rm -r --cached node_modules
git rm --cached .env

# 提交更改
git add .gitignore
git commit -m "chore: add .gitignore"
git push
```

---

## 📊 Git 常用命令

### 日常操作

```bash
# 查看状态
git status

# 添加文件
git add .
git add file.txt

# 提交更改
git commit -m "feat: add new feature"

# 推送到远程
git push

# 拉取远程更改
git pull

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v
```

### 分支操作

```bash
# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature

# 删除分支
git branch -d feature/new-feature
```

---

## 🎉 完成！

现在你的代码已经推送到 GitHub，可以：

1. ✅ 在 GitHub 上查看代码
2. ✅ 部署到 Vercel/Netlify
3. ✅ 与他人分享
4. ✅ 协作开发

---

## 🚀 下一步：部署到 Vercel

代码推送到 GitHub 后，按照 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) 部署到 Vercel。

祝你顺利！🎉
