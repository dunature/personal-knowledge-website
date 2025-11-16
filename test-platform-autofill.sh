#!/bin/bash

# 平台自动填充功能测试脚本

echo "🧪 平台自动填充功能测试"
echo "========================"
echo ""

echo "📋 测试步骤:"
echo "1. 启动开发服务器（如果还没启动）"
echo "2. 访问测试页面: http://localhost:5173/platform-autofill-test"
echo "3. 测试每个平台的自动填充功能"
echo ""

echo "🎯 测试目标:"
echo "✅ YouTube: 应该正常工作"
echo "✅ Bilibili: 现在应该可以工作（使用 Vite 代理）"
echo "✅ GitHub: 应该正常工作"
echo ""

echo "🔍 检查清单:"
echo "- [ ] GitHub 按钮显示"
echo "- [ ] GitHub 获取仓库信息"
echo "- [ ] Bilibili 按钮显示"
echo "- [ ] Bilibili 获取视频信息（标题、UP主、封面）"
echo "- [ ] YouTube 获取视频信息"
echo ""

echo "📝 如果遇到问题:"
echo "1. 打开浏览器控制台（F12）"
echo "2. 查看详细的错误日志"
echo "3. 检查网络请求（Network 标签）"
echo ""

echo "🚀 准备启动开发服务器..."
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动开发服务器
npm run dev
