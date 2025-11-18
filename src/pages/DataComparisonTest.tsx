/**
 * DataComparisonView 组件测试页面
 * 用于独立测试数据对比视图组件
 */

import { Link } from 'react-router-dom';
import { DataComparisonView } from '@/components/settings/DataComparisonView';

export default function DataComparisonTest() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* 页面标题 */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">数据对比视图测试</h1>
                        <p className="text-gray-600 mt-2">
                            测试 DataComparisonView 组件的显示和功能
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        返回主页
                    </Link>
                </div>

                {/* 测试说明 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">测试说明</h2>
                    <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                        <li>此页面直接渲染 DataComparisonView 组件,不受模式限制</li>
                        <li>可以查看组件是否正常加载和显示</li>
                        <li>可以测试刷新按钮功能</li>
                        <li>可以验证数据统计是否正确</li>
                    </ul>
                </div>

                {/* 数据对比组件 */}
                <DataComparisonView />

                {/* 测试步骤 */}
                <div className="mt-6 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">测试步骤</h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>检查组件是否正常显示</li>
                        <li>查看本地数据统计是否正确</li>
                        <li>如果配置了 Gist ID,查看云端数据统计</li>
                        <li>点击刷新按钮,验证数据是否更新</li>
                        <li>在主页添加数据,然后返回此页面刷新查看</li>
                        <li>执行同步操作,验证数据对比是否自动更新</li>
                    </ol>
                </div>

                {/* 调试信息 */}
                <div className="mt-6 bg-gray-100 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">调试信息</h3>
                    <div className="text-xs text-gray-600 space-y-1 font-mono">
                        <div>当前路径: /data-comparison-test</div>
                        <div>组件: DataComparisonView</div>
                        <div>位置: src/components/settings/DataComparisonView.tsx</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
