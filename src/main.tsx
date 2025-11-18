import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { ResourceProvider } from './contexts/ResourceContext.tsx'
import { QAProvider } from './contexts/QAContext.tsx'
import { AutoSyncProvider } from './components/sync/AutoSyncProvider.tsx'
import { SetupGuard } from './components/setup/SetupGuard.tsx'
import { UrlGistHandler } from './components/setup/UrlGistHandler.tsx'
import { migrateLocalStorageResources } from './utils/migratePlaceholderImages.ts'
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
import SyncDebugPage from './pages/SyncDebugPage.tsx'
import ModeSwitcherTest from './pages/ModeSwitcherTest.tsx'
import GistOwnershipTest from './pages/GistOwnershipTest.tsx'
import PlatformAutoFillTest from './pages/PlatformAutoFillTest.tsx'
import BidirectionalSyncTest from './pages/BidirectionalSyncTest.tsx'
import SyncAlreadySyncedTest from './pages/SyncAlreadySyncedTest.tsx'
import DataComparisonDialogTest from './pages/DataComparisonDialogTest.tsx'
import DataComparisonTest from './pages/DataComparisonTest.tsx'
import ManualSyncTest from './pages/ManualSyncTest.tsx'
import App from './App.tsx'
import SetupWizard from './components/setup/SetupWizard.tsx'

// 迁移旧的占位图 URL
migrateLocalStorageResources();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ResourceProvider>
        <QAProvider>
          <AutoSyncProvider>
            <BrowserRouter>
              <UrlGistHandler />
              <SetupGuard>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/setup" element={<SetupWizard onComplete={() => window.location.href = '/'} />} />
                  {/* 开发测试路由 - 生产环境可以移除 */}
                  {import.meta.env.DEV && (
                    <>
                      <Route path="/components" element={<App />} />
                      <Route path="/question-modal-test" element={<QuestionModalTest />} />
                      <Route path="/markdown-test" element={<MarkdownEditorTest />} />
                      <Route path="/drawer-test" element={<EditorDrawerTest />} />
                      <Route path="/error-test" element={<ErrorHandlingTest />} />
                      <Route path="/notification-test" element={<NotificationTest />} />
                      <Route path="/gist-test" element={<GistServiceTest />} />
                      <Route path="/gist-integration-test" element={<GistIntegrationTest />} />
                      <Route path="/sync-debug" element={<SyncDebugPage />} />
                      <Route path="/mode-switcher-test" element={<ModeSwitcherTest />} />
                      <Route path="/gist-ownership-test" element={<GistOwnershipTest />} />
                      <Route path="/platform-autofill-test" element={<PlatformAutoFillTest />} />
                      <Route path="/bidirectional-sync-test" element={<BidirectionalSyncTest />} />
                      <Route path="/sync-already-synced-test" element={<SyncAlreadySyncedTest />} />
                      <Route path="/data-comparison-dialog-test" element={<DataComparisonDialogTest />} />
                      <Route path="/data-comparison-test" element={<DataComparisonTest />} />
                      <Route path="/manual-sync-test" element={<ManualSyncTest />} />
                    </>
                  )}
                </Routes>
              </SetupGuard>
            </BrowserRouter>
          </AutoSyncProvider>
        </QAProvider>
      </ResourceProvider>
    </AuthProvider>
  </StrictMode>,
)
