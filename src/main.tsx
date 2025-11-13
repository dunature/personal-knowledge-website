import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { AutoSyncProvider } from './components/sync/AutoSyncProvider.tsx'
import './index.css'
import HomePage from './pages/HomePage.tsx'
import MarkdownEditorTest from './pages/MarkdownEditorTest.tsx'
import EditorDrawerTest from './pages/EditorDrawerTest.tsx'
import QuestionModalTest from './pages/QuestionModalTest.tsx'
import ErrorHandlingTest from './pages/ErrorHandlingTest.tsx'
import NotificationTest from './pages/NotificationTest.tsx'
import GistServiceTest from './pages/GistServiceTest.tsx'
import GistIntegrationTest from './pages/GistIntegrationTest.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import App from './App.tsx'

// 导航菜单组件
const Navigation = () => (
  <nav style={{
    padding: '10px 20px',
    backgroundColor: '#0047AB',
    color: 'white',
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  }}>
    <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      主页
    </Link>
    <Link to="/components" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      组件测试
    </Link>
    <Link to="/question-modal-test" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      问题弹窗测试
    </Link>
    <Link to="/markdown-test" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      Markdown编辑器
    </Link>
    <Link to="/drawer-test" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      编辑器抽屉
    </Link>
    <Link to="/error-test" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      错误处理测试
    </Link>
    <Link to="/notification-test" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      通知系统测试
    </Link>
    <Link to="/gist-test" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      Gist服务测试
    </Link>
    <Link to="/gist-integration-test" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      Gist集成测试
    </Link>
    <Link to="/settings" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      设置
    </Link>
  </nav>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AutoSyncProvider>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/components" element={<App />} />
            <Route path="/question-modal-test" element={<QuestionModalTest />} />
            <Route path="/markdown-test" element={<MarkdownEditorTest />} />
            <Route path="/drawer-test" element={<EditorDrawerTest />} />
            <Route path="/error-test" element={<ErrorHandlingTest />} />
            <Route path="/notification-test" element={<NotificationTest />} />
            <Route path="/gist-test" element={<GistServiceTest />} />
            <Route path="/gist-integration-test" element={<GistIntegrationTest />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </BrowserRouter>
      </AutoSyncProvider>
    </AuthProvider>
  </StrictMode>,
)
