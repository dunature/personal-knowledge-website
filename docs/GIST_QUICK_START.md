# GitHub Gist 持久化 - 快速开始

## 🚀 5 分钟快速上手

### 步骤 1: 获取 GitHub Token（2 分钟）

1. 访问 GitHub Token 设置页面：
   ```
   https://github.com/settings/tokens/new
   ```

2. 填写信息：
   - **Note**: `Personal Knowledge Website`
   - **Expiration**: 选择过期时间（建议 90 天或更长）
   - **Select scopes**: 勾选 `gist` ✓

3. 点击 **Generate token**

4. **重要**：复制生成的 Token（以 `ghp_` 开头）
   - ⚠️ Token 只显示一次，请妥善保存

### 步骤 2: 配置应用（1 分钟）

1. 打开测试页面：
   ```
   http://localhost:5173/gist-integration-test
   ```

2. 点击 **"打开配置向导"** 按钮

3. 选择 **"拥有者模式"**

4. 粘贴你的 GitHub Token

5. 点击 **"验证并保存"**

6. 看到 ✓ "Token 验证成功" 即可

### 步骤 3: 迁移数据（1 分钟）

1. 点击 **"打开迁移向导"** 按钮

2. 查看本地数据统计

3. 点击 **"迁移到 Gist"**

4. 等待迁移完成，获得 Gist ID

5. 完成！🎉

### 步骤 4: 验证（1 分钟）

1. 访问你的 GitHub Gists：
   ```
   https://gist.github.com/你的用户名
   ```

2. 应该能看到新创建的 Gist：
   - 标题：`Personal Knowledge Base Data`
   - 文件：`resources.json`, `questions.json`, `metadata.json` 等

3. 在应用中修改数据，等待 3 秒

4. 刷新 Gist 页面，应该能看到更新

---

## 🎯 核心功能

### 拥有者模式
- ✅ 完整的编辑权限
- ✅ 自动同步到 GitHub Gist
- ✅ 数据加密存储
- ✅ 跨设备同步

### 访客模式
- ✅ 只读访问
- ✅ 无需 Token
- ✅ 通过 Gist ID 访问
- ✅ 适合分享

---

## 📱 使用场景

### 场景 1: 个人使用（拥有者模式）
```
1. 配置 Token
2. 迁移数据
3. 正常使用应用
4. 数据自动同步到 GitHub
```

### 场景 2: 分享给他人（访客模式）
```
1. 获取你的 Gist ID
2. 分享链接：https://你的网站.com?gist=你的GistID
3. 他人可以只读访问你的数据
```

### 场景 3: 跨设备同步
```
设备 A:
1. 配置 Token
2. 迁移数据

设备 B:
1. 配置相同的 Token
2. 输入相同的 Gist ID
3. 数据自动同步
```

---

## 🔧 常用操作

### 查看同步状态
- 查看页面顶部的同步指示器
- 绿色 = 已同步
- 蓝色 = 同步中
- 红色 = 同步失败

### 手动同步
- 点击同步指示器中的刷新按钮
- 或等待自动同步（数据变更后 3 秒）

### 切换模式
1. 点击"清除所有数据"
2. 重新打开配置向导
3. 选择新模式

### 分享数据
1. 确保 Gist 是公开的
2. 获取 Gist ID（在设置中查看）
3. 分享链接：`https://你的网站.com?gist=GistID`

---

## ⚠️ 注意事项

### 安全性
- ✓ Token 加密存储在本地
- ✓ 不会发送到任何第三方服务器
- ✓ 只与 GitHub API 通信
- ⚠️ 不要分享你的 Token
- ⚠️ 定期更新 Token

### 数据同步
- ✓ 自动同步有 3 秒防抖
- ✓ 失败会自动重试（最多 3 次）
- ✓ 支持离线操作（待实现）
- ⚠️ 大量数据可能需要更长时间

### 浏览器兼容性
- ✓ Chrome 60+
- ✓ Firefox 55+
- ✓ Safari 11+
- ✓ Edge 79+
- ⚠️ 需要支持 Web Crypto API

---

## 🆘 遇到问题？

### Token 验证失败
```
1. 确认 Token 格式正确（以 ghp_ 开头）
2. 确认 Token 有 gist 权限
3. 检查网络连接
4. 尝试重新生成 Token
```

### 同步失败
```
1. 检查网络连接
2. 确认 Token 未过期
3. 查看浏览器控制台错误
4. 尝试手动同步
```

### 数据丢失
```
1. 检查 LocalStorage（F12 → Application → Local Storage）
2. 检查 GitHub Gist 是否有数据
3. 尝试从 Gist 重新加载
```

### 更多帮助
- 查看完整测试指南：`docs/development/TESTING_GUIDE.md`
- 查看进度文档：`docs/development/GIST_INTEGRATION_PROGRESS.md`
- 提交 Issue：[GitHub Issues]

---

## 📚 相关文档

- [测试指南](./development/TESTING_GUIDE.md)
- [实现进度](./development/GIST_INTEGRATION_PROGRESS.md)
- [开发文档](./development/GIST_INTEGRATION.md)

---

**祝你使用愉快！** 🎉
