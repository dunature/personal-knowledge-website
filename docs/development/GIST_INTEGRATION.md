# GitHub Gist 集成开发文档

本文档面向开发者，详细说明 GitHub Gist 数据持久化功能的技术实现。

## 目录

- [架构概览](#架构概览)
- [核心服务](#核心服务)
- [数据结构](#数据结构)
- [API 接口](#api-接口)
- [同步机制](#同步机制)
- [错误处理](#错误处理)
- [安全性](#安全性)
- [性能优化](#性能优化)
- [测试策略](#测试策略)

## 架构概览

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        UI 层                                 │
│  SetupWizard | SettingsPage | SyncIndicator | ShareButton  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Context 层                              │
│         AuthContext | ResourceContext | QAContext           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Service 层                              │
│  GistService | SyncService | AuthService | CacheService     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Storage 层                              │
│           GitHub Gist API  |  LocalStorage                  │
└─────────────────────────────────────────────────────────────┘
```

### 数据流

**拥有者模式写入流程**:
```
User Action → Context → SyncService (debounce) → GistService → GitHub API
                ↓
         CacheService → LocalStorage
```

**访客模式读取流程**:
```
Gist ID → GistService → GitHub API (public) → CacheService → Context → UI
```

## 核心服务

### 1. GistService

**位置**: `src/services/gistService.ts`

**职责**: 封装所有 GitHub Gist API 调用

**主要方法**:

```typescript
class GistService {
  // Token 验证
  async validateToken(token: string): Promise<TokenValidationResult>
  
  // Gist CRUD
  async createGist(data: GistData, token: string): Promise<GistCreateResult>
  async getGist(gistId: string, token?: string): Promise<GistData>
  async updateGist(gistId: string, data: GistData, token: string): Promise<void>
  
  // 版本历史
  async getGistHistory(gistId: string, token?: string): Promise<GistVersion[]>
  async getGistVersion(gistId: string, version: string, token?: string): Promise<GistData>
}
```

**使用示例**:

```typescript
import { gistService } from '@/services/gistService';

// 验证 Token
const result = await gistService.validateToken('ghp_xxxxx');
if (result.valid) {
  console.log('User:', result.username);
}

// 创建 Gist
const gistResult = await gistService.createGist({
  resources: [...],
  questions: [...],
  subQuestions: [...],
  answers: [...],
  metadata: { version: '1.0.0', lastSync: new Date().toISOString(), owner: 'username' }
}, token);

// 获取 Gist（公开访问）
const data = await gistService.getGist('gist_id');
```

### 2. SyncService

**位置**: `src/services/syncService.ts`

**职责**: 管理数据同步逻辑和状态

**主要方法**:

```typescript
class SyncService {
  // 同步操作
  async syncToGist(): Promise<SyncResult>
  async syncFromGist(): Promise<SyncResult>
  async syncNow(): Promise<SyncResult>
  
  // 触发同步（带防抖）
  triggerSync(): void
  
  // 状态管理
  getSyncStatus(): SyncStatus
  onSyncStatusChange(callback: (status: SyncStatus) => void): () => void
  
  // 待同步变更
  async addPendingChange(change: PendingChange): Promise<void>
  async getPendingChanges(): Promise<PendingChange[]>
  async syncPendingChanges(): Promise<SyncResult>
  
  // 版本恢复
  async restoreFromVersion(versionData: GistData): Promise<SyncResult>
}
```

**使用示例**:

```typescript
import { syncService } from '@/services/syncService';

// 监听同步状态
const unsubscribe = syncService.onSyncStatusChange((status) => {
  console.log('Sync status:', status);
});

// 触发同步（防抖）
syncService.triggerSync();

// 立即同步
await syncService.syncNow();

// 添加待同步变更
await syncService.addPendingChange({
  type: 'create',
  entity: 'resource',
  id: 'res_123',
  data: resourceData,
  timestamp: new Date().toISOString()
});
```

### 3. AuthService

**位置**: `src/services/authService.ts`

**职责**: 管理认证和用户状态

**主要方法**:

```typescript
class AuthService {
  // Token 管理
  async setToken(token: string): Promise<void>
  async getToken(): Promise<string | null>
  async clearToken(): Promise<void>
  
  // 认证状态
  isAuthenticated(): boolean
  async getCurrentUser(): Promise<User | null>
  
  // 模式管理
  getMode(): AppMode
  switchMode(mode: AppMode): void
  
  // Gist ID 管理
  getGistId(): string | null
  setGistId(gistId: string): void
  
  // 分享功能
  generateShareLink(): string | null
}
```

### 4. CacheService

**位置**: `src/services/cacheService.ts`

**职责**: 管理本地数据缓存

**存储键名**:

```typescript
export const STORAGE_KEYS = {
  TOKEN: 'pkw_github_token',
  GIST_ID: 'pkw_gist_id',
  MODE: 'pkw_mode',
  RESOURCES: 'pkw_resources',
  QUESTIONS: 'pkw_questions',
  SUB_QUESTIONS: 'pkw_sub_questions',
  ANSWERS: 'pkw_answers',
  METADATA: 'pkw_metadata',
  SYNC_STATUS: 'pkw_sync_status',
  LAST_SYNC: 'pkw_last_sync',
  PENDING_CHANGES: 'pkw_pending_changes'
};
```

## 数据结构

### GistData

完整的 Gist 数据结构：

```typescript
interface GistData {
  resources: Resource[];
  questions: BigQuestion[];
  subQuestions: SubQuestion[];
  answers: TimelineAnswer[];
  metadata: GistMetadata;
}

interface GistMetadata {
  version: string;
  lastSync: string;
  owner: string;
}
```

### Gist 文件结构

在 GitHub Gist 中，数据被分为三个文件：

```json
{
  "description": "Personal Knowledge Base Data",
  "public": true,
  "files": {
    "resources.json": {
      "content": "[{...}]"
    },
    "questions.json": {
      "content": "{\"questions\": [...], \"subQuestions\": [...], \"answers\": [...]}"
    },
    "metadata.json": {
      "content": "{\"version\": \"1.0.0\", \"lastSync\": \"...\", \"owner\": \"...\"}"
    }
  }
}
```

### PendingChange

待同步变更的数据结构：

```typescript
interface PendingChange {
  type: 'create' | 'update' | 'delete';
  entity: 'resource' | 'question' | 'subQuestion' | 'answer';
  id: string;
  data?: any;
  timestamp: string;
}
```

## API 接口

### GitHub API 端点

```typescript
const GITHUB_API_BASE = 'https://api.github.com';

// 用户信息
GET /user

// Gist 操作
POST /gists                    // 创建 Gist
GET /gists/{gist_id}          // 获取 Gist
PATCH /gists/{gist_id}        // 更新 Gist

// 版本历史
GET /gists/{gist_id}/commits  // 获取提交历史
GET /gists/{gist_id}/{sha}    // 获取特定版本
```

### 请求头

```typescript
const headers = {
  'Authorization': `token ${token}`,  // 认证（可选，公开 Gist 不需要）
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json'
};
```

### 速率限制

- **已认证**: 5000 次/小时
- **未认证**: 60 次/小时

检查速率限制：

```typescript
const response = await fetch('https://api.github.com/rate_limit', {
  headers: { Authorization: `token ${token}` }
});
const data = await response.json();
console.log('Remaining:', data.resources.core.remaining);
console.log('Reset at:', new Date(data.resources.core.reset * 1000));
```

## 同步机制

### 防抖机制

避免频繁 API 调用：

```typescript
// 配置
const DEBOUNCE_TIME = 3000; // 3秒

// 实现
triggerSync(): void {
  if (this.syncTimer) {
    clearTimeout(this.syncTimer);
  }
  this.syncTimer = setTimeout(() => {
    this.syncToGist();
  }, DEBOUNCE_TIME);
}
```

### 增量同步

只同步变更的数据：

```typescript
// 1. 记录变更
await syncService.addPendingChange({
  type: 'update',
  entity: 'resource',
  id: 'res_123',
  data: updatedResource,
  timestamp: new Date().toISOString()
});

// 2. 合并变更
const optimizedChanges = this.optimizePendingChanges(changes);

// 3. 应用到完整数据集
const gistData = await this.mergeChanges(optimizedChanges);

// 4. 上传到 Gist
await gistService.updateGist(gistId, gistData, token);
```

### 变更优化

合并相同实体的多次变更：

```typescript
// create + update = create (使用最新数据)
// create + delete = 无操作
// update + update = update (使用最新数据)
// update + delete = delete
```

### 离线支持

```typescript
// 1. 检测网络状态
if (!navigator.onLine) {
  // 保存变更到本地
  await cacheService.saveData(STORAGE_KEYS.PENDING_CHANGES, changes);
  return;
}

// 2. 监听网络恢复
window.addEventListener('online', async () => {
  // 同步待同步变更
  await syncService.syncPendingChanges();
});
```

## 错误处理

### 错误类型

```typescript
enum GistErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INVALID_DATA = 'INVALID_DATA',
  UNKNOWN = 'UNKNOWN'
}
```

### 错误处理策略

```typescript
try {
  await gistService.updateGist(gistId, data, token);
} catch (error) {
  const gistError = toGistError(error, { context: 'updateGist' });
  
  switch (gistError.type) {
    case GistErrorType.NETWORK_ERROR:
      // 使用本地缓存，加入重试队列
      await syncService.addPendingChange(change);
      break;
      
    case GistErrorType.AUTH_ERROR:
      // 清除 Token，提示重新配置
      await authService.clearToken();
      break;
      
    case GistErrorType.RATE_LIMIT:
      // 延迟重试
      setTimeout(() => syncService.syncNow(), gistError.retryAfter);
      break;
      
    default:
      // 显示错误消息
      showToast('error', gistError.getUserMessage());
  }
}
```

### 重试机制

```typescript
// 指数退避重试
const MAX_RETRIES = 3;
const BASE_DELAY = 5000; // 5秒

for (let i = 0; i < MAX_RETRIES; i++) {
  try {
    await syncToGist();
    break;
  } catch (error) {
    if (i === MAX_RETRIES - 1) throw error;
    const delay = BASE_DELAY * Math.pow(2, i);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
```

## 安全性

### Token 加密

使用 Web Crypto API 加密存储：

```typescript
async function encryptToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return JSON.stringify({
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv))
  });
}
```

### 数据验证

验证从 Gist 加载的数据：

```typescript
export function validateGistData(data: any): data is GistData {
  return (
    Array.isArray(data.resources) &&
    Array.isArray(data.questions) &&
    Array.isArray(data.subQuestions) &&
    Array.isArray(data.answers) &&
    typeof data.metadata === 'object' &&
    typeof data.metadata.version === 'string' &&
    typeof data.metadata.lastSync === 'string' &&
    typeof data.metadata.owner === 'string'
  );
}
```

### XSS 防护

清理用户输入的内容：

```typescript
import DOMPurify from 'dompurify';

function sanitizeContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target']
  });
}
```

## 性能优化

### 1. 数据压缩

对大数据进行压缩（未实现，预留）：

```typescript
async function compressData(data: string): Promise<string> {
  if (data.length < 50 * 1024) return data;
  
  const encoder = new TextEncoder();
  const stream = new CompressionStream('gzip');
  const writer = stream.writable.getWriter();
  
  writer.write(encoder.encode(data));
  writer.close();
  
  const compressed = await new Response(stream.readable).arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(compressed)));
}
```

### 2. 智能缓存

```typescript
const CACHE_CONFIG = {
  resources: { maxAge: 5 * 60 * 1000 },      // 5分钟
  questions: { maxAge: 5 * 60 * 1000 },      // 5分钟
  metadata: { maxAge: 60 * 60 * 1000 },      // 1小时
  history: { maxAge: 24 * 60 * 60 * 1000 }   // 24小时
};

async function getCachedData<T>(key: string): Promise<T | null> {
  const cached = await cacheService.getData<T>(key);
  const isStale = await cacheService.isStale(key, CACHE_CONFIG[key].maxAge);
  
  if (cached && !isStale) {
    return cached;
  }
  
  return null;
}
```

### 3. 应用启动优化

```typescript
// 优先使用本地缓存
async function initializeApp() {
  // 1. 立即从缓存加载数据
  const cachedData = await cacheService.getData(STORAGE_KEYS.RESOURCES);
  setResources(cachedData || []);
  
  // 2. 在后台异步同步
  syncService.syncFromGist().then((result) => {
    if (result.success) {
      // 更新 UI
      loadDataFromCache();
    }
  });
}
```

## 测试策略

### 单元测试

测试各个服务的方法：

```typescript
import { describe, it, expect, vi } from 'vitest';
import { gistService } from '@/services/gistService';

describe('GistService', () => {
  it('should validate token', async () => {
    const result = await gistService.validateToken('valid_token');
    expect(result.valid).toBe(true);
    expect(result.username).toBeDefined();
  });
  
  it('should create gist', async () => {
    const data = { /* ... */ };
    const result = await gistService.createGist(data, 'token');
    expect(result.id).toBeDefined();
  });
});
```

### 集成测试

测试完整流程：

```typescript
describe('Sync Flow', () => {
  it('should sync data to gist', async () => {
    // 1. 设置 Token
    await authService.setToken('test_token');
    
    // 2. 添加数据
    await resourceContext.addResource(testResource);
    
    // 3. 触发同步
    const result = await syncService.syncNow();
    
    // 4. 验证结果
    expect(result.success).toBe(true);
    expect(authService.getGistId()).toBeDefined();
  });
});
```

### Mock 策略

Mock GitHub API 响应：

```typescript
vi.mock('@/services/gistService', () => ({
  gistService: {
    validateToken: vi.fn().mockResolvedValue({
      valid: true,
      username: 'testuser'
    }),
    createGist: vi.fn().mockResolvedValue({
      id: 'test_gist_id',
      url: 'https://api.github.com/gists/test_gist_id'
    })
  }
}));
```

## 开发工具

### 调试模式

启用详细日志：

```typescript
// .env.local
VITE_ENABLE_DEBUG=true

// 使用
if (import.meta.env.VITE_ENABLE_DEBUG) {
  console.log('Sync status:', syncService.getSyncStatus());
  console.log('Pending changes:', await syncService.getPendingChanges());
}
```

### 测试页面

创建测试页面验证功能：

```typescript
// src/pages/GistIntegrationTest.tsx
export function GistIntegrationTest() {
  return (
    <div>
      <button onClick={() => testTokenValidation()}>Test Token</button>
      <button onClick={() => testSync()}>Test Sync</button>
      <button onClick={() => testVersionHistory()}>Test History</button>
    </div>
  );
}
```

## 部署注意事项

### 环境变量

```env
# .env.production
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=false
```

### Vercel 配置

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; connect-src 'self' https://api.github.com;"
        }
      ]
    }
  ]
}
```

## 参考资源

- [GitHub Gist API 文档](https://docs.github.com/en/rest/gists)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**最后更新**: 2024-01-20
