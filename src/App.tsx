import './App.css'
import { useState, lazy, Suspense } from 'react'
import { ResourceSection } from '@/components/layout/ResourceSection'
import { QASection } from '@/components/layout/QASection'
import LoadingState from '@/components/common/LoadingState'
import type { Resource } from '@/types/resource'
import type { BigQuestion, SubQuestion, TimelineAnswer } from '@/types/question'
import type { Category } from '@/components/resource/CategoryFilter'

// 懒加载大型组件
const QuestionModal = lazy(() => import('@/components/qa/QuestionModal').then(module => ({ default: module.QuestionModal })))

function App() {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  // 示例资源数据
  const sampleResources: Resource[] = [
    {
      id: 'res_001',
      title: 'Deep Dive into React Hooks',
      url: 'https://youtube.com/watch?v=example',
      type: 'youtube_video',
      cover: 'https://via.placeholder.com/320x180/0047AB/FFFFFF?text=React+Hooks',
      platform: 'YouTube',
      content_tags: ['Fundamentals', 'Tutorial', 'Deep Dive'],
      category: 'AI学习',
      author: 'Tech Channel',
      recommendation: '深入讲解React Hooks的最佳实践',
      metadata: { duration: '45:30' },
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'res_002',
      title: 'TypeScript Best Practices',
      url: 'https://blog.example.com/typescript',
      type: 'blog',
      cover: 'https://via.placeholder.com/320x180/2E7D32/FFFFFF?text=TypeScript',
      platform: 'Medium',
      content_tags: ['Fundamentals', 'Best Practices'],
      category: '编程',
      author: 'John Doe',
      recommendation: 'TypeScript开发必读文章',
      metadata: { read_time: 10 },
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z',
    },
    {
      id: 'res_003',
      title: 'Awesome React Components',
      url: 'https://github.com/example/awesome-react',
      type: 'github',
      cover: 'https://via.placeholder.com/320x180/E65100/FFFFFF?text=GitHub+Repo',
      platform: 'GitHub',
      content_tags: ['Library', 'Framework'],
      category: '编程',
      author: 'awesome-react',
      recommendation: '精选React组件库集合',
      metadata: { stars: 15000, language: 'TypeScript' },
      created_at: '2024-01-05T10:00:00Z',
      updated_at: '2024-01-05T10:00:00Z',
    },
  ]

  // 示例分类数据
  const categories: Category[] = [
    { id: '', name: '全部' },
    { id: 'AI学习', name: 'AI学习' },
    { id: '编程', name: '编程' },
    { id: '设计', name: '设计' },
  ]

  // 示例问题数据
  const sampleQuestions: BigQuestion[] = [
    {
      id: 'q_001',
      title: '如何搭建个人博客',
      description: '我想搭建一个个人博客用于记录学习笔记，需要考虑哪些技术栈？',
      status: 'solving',
      category: '技术',
      summary: '最终选择了Hugo + GitHub Pages方案，简单高效。',
      sub_questions: ['sq_001', 'sq_002'],
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'q_002',
      title: 'React性能优化最佳实践',
      description: '在大型React应用中，如何进行性能优化？',
      status: 'solved',
      category: '技术',
      summary: '通过React.memo、useMemo、useCallback等方法成功优化。',
      sub_questions: ['sq_003'],
      created_at: '2023-12-20T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z',
    },
    {
      id: 'q_003',
      title: 'TypeScript类型系统深入理解',
      description: 'TypeScript的高级类型如何使用？',
      status: 'unsolved',
      category: '技术',
      summary: '',
      sub_questions: [],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
    },
  ]

  // 示例小问题数据
  const sampleSubQuestions: SubQuestion[] = [
    {
      id: 'sq_001',
      parent_id: 'q_001',
      title: '选择什么技术栈',
      status: 'solved',
      answers: ['ans_001', 'ans_002'],
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-05T10:00:00Z',
    },
    {
      id: 'sq_002',
      parent_id: 'q_001',
      title: '如何部署到GitHub Pages',
      status: 'solving',
      answers: ['ans_003'],
      created_at: '2024-01-05T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z',
    },
  ]

  // 示例回答数据
  const sampleAnswers: TimelineAnswer[] = [
    {
      id: 'ans_001',
      question_id: 'sq_001',
      content: '考虑了Jekyll、Hugo、Hexo三个静态网站生成器。',
      timestamp: '2024-01-02T10:00:00Z',
      created_at: '2024-01-02T10:00:00Z',
      updated_at: '2024-01-02T10:00:00Z',
    },
    {
      id: 'ans_002',
      question_id: 'sq_001',
      content: '最终选择了Hugo，因为构建速度快，主题丰富。',
      timestamp: '2024-01-05T10:00:00Z',
      created_at: '2024-01-05T10:00:00Z',
      updated_at: '2024-01-05T10:00:00Z',
    },
    {
      id: 'ans_003',
      question_id: 'sq_002',
      content: '使用GitHub Actions自动部署，配置workflow文件。',
      timestamp: '2024-01-10T10:00:00Z',
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z',
    },
  ]

  // 小问题数量统计
  const subQuestionCounts = {
    'q_001': 2,
    'q_002': 1,
    'q_003': 0,
  }

  // 获取选中问题的详细信息
  const selectedQuestion = sampleQuestions.find(q => q.id === selectedQuestionId)
  const selectedSubQuestions = selectedQuestion
    ? sampleSubQuestions.filter(sq => selectedQuestion.sub_questions.includes(sq.id))
    : []
  const answersMap: Record<string, TimelineAnswer[]> = {}
  selectedSubQuestions.forEach(sq => {
    answersMap[sq.id] = sampleAnswers.filter(ans => ans.question_id === sq.id)
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* 页面标题 */}
      <div style={{
        padding: '40px 20px',
        backgroundColor: '#0047AB',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
          个人知识管理系统
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          测试所有根据任务编写的组件
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 资源导航区域 */}
        <div style={{ marginBottom: '60px' }}>
          <ResourceSection
            resources={sampleResources}
            categories={categories}
            onEdit={(id) => alert(`编辑资源: ${id}`)}
            onDelete={(id) => alert(`删除资源: ${id}`)}
            onTagClick={(tag) => alert(`点击标签: ${tag}`)}
          />
        </div>

        {/* 问答板区域 */}
        <div style={{ marginBottom: '60px' }}>
          <QASection
            questions={sampleQuestions}
            subQuestionCounts={subQuestionCounts}
            onQuestionClick={(id) => setSelectedQuestionId(id)}
          />
        </div>

        {/* 测试说明 */}
        <div style={{
          padding: '30px',
          backgroundColor: '#E8F5E9',
          borderRadius: '8px',
          border: '2px solid #2E7D32'
        }}>
          <h2 style={{ color: '#2E7D32', marginBottom: '20px' }}>✅ 组件测试说明</h2>
          <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#333' }}>
            <li><strong>ResourceSection</strong>: 资源导航区域，支持分类筛选、标签筛选、搜索和排序</li>
            <li><strong>QASection</strong>: 问答板区域，显示问题列表，支持筛选和排序</li>
            <li><strong>QuestionModal</strong>: 点击问题可打开全屏弹窗，查看详细信息</li>
            <li><strong>SubQuestion</strong>: 小问题组件，支持展开/收起查看时间线回答</li>
            <li><strong>CategoryFilter</strong>: 分类筛选组件</li>
            <li><strong>SearchBar</strong>: 搜索和排序组件</li>
          </ul>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            💡 提示：点击"all time"按钮展开分类筛选，点击问题标题查看详情
          </p>
        </div>
      </div>

      {/* 问题详情弹窗 - 使用Suspense包裹懒加载组件 */}
      {selectedQuestion && (
        <Suspense fallback={<LoadingState message="加载中..." />}>
          <QuestionModal
            question={selectedQuestion}
            subQuestions={selectedSubQuestions}
            answers={answersMap}
            isOpen={!!selectedQuestionId}
            onClose={() => setSelectedQuestionId(null)}
            onEdit={() => alert('编辑大问题')}
            onStatusChange={(status) => alert(`修改状态为: ${status}`)}
            onEditSummary={() => alert('编辑总结')}
            onEditSubQuestion={(id) => alert(`编辑小问题: ${id}`)}
            onAddAnswer={(sqId) => alert(`添加回答到小问题: ${sqId}`)}
            onEditAnswer={(ansId) => alert(`编辑回答: ${ansId}`)}
            onAddSubQuestion={() => alert('添加小问题')}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App
