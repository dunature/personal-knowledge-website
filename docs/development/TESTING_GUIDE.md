# GitHub Gist 集成测试指南

## 🧪 测试页面

访问测试页面：`/gist-integration-test`

这个页面提供了完整的功能测试界面，可以测试所有核心服务和组件。

---

## 📋 测试清单

### 1. 加密工具测试 ✓
**测试内容**：
- Token 加密
- Token 解密
- 加密/解密一致性

**预期结果**：
```json
{
  "encrypted": "...",
  "decrypted": "ghp_test123456789",
  "match": true
}
```

### 2. AuthService 测试 ✓
**测试内容**：
- 获取当前模式
- 检查认证状态
- 获取用户信息
- 获取 Gist ID

**预期结果**：
```json
{
  "mode": "visitor",
  "isAuth": false,
  "user": null,
  "gistId": null
}
```

### 3. CacheService 测试 ✓
**测试内容**：
- 保存数据到 LocalStorage
- 读取数据
- 获取缓存信息
- 清除数据

**预期结果**：
```json
{
  "saved": { "test": "data", "timestamp": 1234567890 },
  "retrieved": { "test": "data", "timestamp": 1234567890 },
  "cacheInfo": { ... }
}
```

### 4. PermissionService 测试 ✓
**测试内容**：
- 检查创建权限
- 检查编辑权限
- 检查删除权限
- 检查同步权限
- 获取当前模式

**预期结果**（访客模式）：
```json
{
  "canCreate": false,
  "canEdit": false,
  "canDelete": false,
  "canSync": false,
  "mode": "visitor",
  "isOwner": false,
  "isVisitor": true
}
```

### 5. MigrationService 测试 ✓
**测试内容**：
- 检测本地数据
- 检查是否需要迁移

**预期结果**：
```json
{
  "localData": {
    "hasResources": false,
    "hasQuestions": false,
    "resourceCount": 0,
    "questionCount": 0,
    "totalSize": 0
  },
  "needsMigration": false
}
```

### 6. SyncService 测试 ✓
**测试内容**：
- 获取同步状态
- 获取最后同步时间

**预期结果**：
```json
{
  "status": "idle",
  "lastSync": null
}
```

---

## 🔄 完整测试流程

### 阶段 1: 基础功能测试（无需 Token）

1. **打开测试页面**
   ```
   http://localhost:5173/gist-integration-test
   ```

2. **运行所有基础测试**
   - 点击"1. 测试加密工具"
   - 点击"2. 测试 AuthService"
   - 点击"3. 测试 CacheService"
   - 点击"4. 测试 PermissionService"
   - 点击"5. 测试 MigrationService"
   - 点击"6. 测试 SyncService"

3. **验证结果**
   - 所有测试应该显示绿色"✓ 成功"
   - 检查返回的数据是否符合预期

### 阶段 2: 配置向导测试（需要 GitHub Token）

1. **准备 GitHub Token**
   - 访问：https://github.com/settings/tokens
   - 创建新 Token（classic）
   - 权限：`gist` (Create gists)
   - 复制 Token

2. **打开配置向导**
   - 点击"打开配置向导"按钮
   - 选择"拥有者模式"
   - 粘贴 GitHub Token
   - 点击"验证并保存"

3. **验证配置**
   - 应该看到"Token 验证成功"
   - 模式指示器应该显示用户名和头像
   - 再次运行"测试 AuthService"，应该看到：
     ```json
     {
       "mode": "owner",
       "isAuth": true,
       "user": { "username": "...", "avatarUrl": "..." },
       "gistId": null
     }
     ```

### 阶段 3: 数据迁移测试

1. **准备测试数据**
   - 在应用中添加一些资源或问题
   - 或者使用默认的示例数据

2. **打开迁移向导**
   - 点击"打开迁移向导"按钮
   - 查看本地数据统计
   - 点击"迁移到 Gist"

3. **验证迁移**
   - 应该看到"迁移完成"消息
   - 获得一个 Gist ID
   - 访问 https://gist.github.com/你的用户名 查看创建的 Gist

### 阶段 4: 同步功能测试

1. **手动同步测试**
   - 点击同步指示器中的刷新按钮
   - 或点击"手动同步"测试按钮
   - 观察同步状态变化：idle → syncing → success

2. **自动同步测试**
   - 在应用中修改数据（添加/编辑/删除资源或问题）
   - 等待 3 秒（防抖时间）
   - 应该自动触发同步

3. **验证同步结果**
   - 访问 GitHub Gist 页面
   - 查看文件内容是否更新
   - 检查 `metadata.json` 中的 `lastModified` 时间

### 阶段 5: 访客模式测试

1. **切换到访客模式**
   - 点击"清除所有数据"（会清除 Token）
   - 刷新页面
   - 打开配置向导
   - 选择"访客模式"
   - 输入之前创建的 Gist ID

2. **验证访客模式**
   - 模式指示器应该显示"访客模式"
   - 运行"测试 PermissionService"，所有权限应该为 false
   - 在主应用中，编辑/删除/添加按钮应该隐藏

3. **验证数据加载**
   - 应该能看到从 Gist 加载的数据
   - 数据应该是只读的

---

## 🐛 常见问题排查

### 问题 1: Token 验证失败
**可能原因**：
- Token 格式错误
- Token 权限不足
- 网络连接问题

**解决方法**：
1. 确认 Token 以 `ghp_` 开头
2. 确认 Token 有 `gist` 权限
3. 检查浏览器控制台的网络请求

### 问题 2: 同步失败
**可能原因**：
- Token 过期
- Gist 不存在
- 网络问题

**解决方法**：
1. 重新验证 Token
2. 检查 Gist ID 是否正确
3. 查看浏览器控制台错误信息

### 问题 3: 数据未加载
**可能原因**：
- Gist ID 错误
- Gist 是私有的（访客模式无法访问）
- 数据格式不正确

**解决方法**：
1. 确认 Gist ID 正确
2. 确认 Gist 是公开的
3. 检查 Gist 文件结构

### 问题 4: 加密错误
**可能原因**：
- 浏览器不支持 Web Crypto API
- LocalStorage 被禁用

**解决方法**：
1. 使用现代浏览器（Chrome、Firefox、Safari）
2. 确保 LocalStorage 可用
3. 检查浏览器隐私设置

---

## 📊 测试报告模板

```markdown
## 测试报告

**测试日期**: YYYY-MM-DD
**测试人员**: [姓名]
**浏览器**: Chrome/Firefox/Safari [版本]

### 测试结果

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 加密工具 | ✓ / ✗ | |
| AuthService | ✓ / ✗ | |
| CacheService | ✓ / ✗ | |
| PermissionService | ✓ / ✗ | |
| MigrationService | ✓ / ✗ | |
| SyncService | ✓ / ✗ | |
| 配置向导 | ✓ / ✗ | |
| 数据迁移 | ✓ / ✗ | |
| 手动同步 | ✓ / ✗ | |
| 自动同步 | ✓ / ✗ | |
| 访客模式 | ✓ / ✗ | |

### 发现的问题

1. [问题描述]
   - 重现步骤：
   - 预期结果：
   - 实际结果：

### 建议

[改进建议]
```

---

## 🔍 调试技巧

### 1. 查看 LocalStorage
```javascript
// 在浏览器控制台执行
console.log(localStorage);

// 查看特定键
console.log(localStorage.getItem('pkw_github_token'));
console.log(localStorage.getItem('pkw_mode'));
console.log(localStorage.getItem('pkw_gist_id'));
```

### 2. 查看同步状态
```javascript
// 在浏览器控制台执行
import { syncService } from '@/services/syncService';
console.log(syncService.getSyncStatus());
```

### 3. 手动触发同步
```javascript
// 在浏览器控制台执行
import { syncService } from '@/services/syncService';
await syncService.syncNow();
```

### 4. 清除所有数据
```javascript
// 在浏览器控制台执行
localStorage.clear();
location.reload();
```

---

## ✅ 测试完成标准

所有测试通过的标准：

1. ✓ 所有 6 个基础测试显示绿色成功
2. ✓ 配置向导可以成功验证 Token
3. ✓ 数据迁移成功创建 Gist
4. ✓ 手动同步成功
5. ✓ 自动同步在数据变更后 3 秒内触发
6. ✓ 访客模式可以加载数据但无法编辑
7. ✓ 权限控制正确（访客模式隐藏编辑按钮）
8. ✓ 模式指示器正确显示状态
9. ✓ 同步指示器正确显示同步状态
10. ✓ 无控制台错误

---

**最后更新**: 2025-11-12
**版本**: v1.0.0
