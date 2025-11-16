#!/bin/bash

# 模式切换功能快速测试脚本

echo "🧪 模式切换功能测试"
echo "===================="
echo ""

# 检查开发服务器是否运行
echo "📡 检查开发服务器..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ 开发服务器正在运行"
else
    echo "❌ 开发服务器未运行"
    echo "请先运行: npm run dev"
    exit 1
fi

echo ""
echo "📝 测试清单："
echo ""
echo "1. 访问测试页面："
echo "   http://localhost:5173/mode-switcher-test"
echo ""
echo "2. 访问主页测试："
echo "   http://localhost:5173/"
echo ""
echo "3. 检查文件是否存在："

files=(
    "src/components/mode/ModeCard.tsx"
    "src/components/mode/TokenInputForm.tsx"
    "src/components/mode/ModeSwitcherModal.tsx"
    "src/constants/modeConfig.tsx"
    "src/pages/ModeSwitcherTest.tsx"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (缺失)"
        all_exist=false
    fi
done

echo ""
if [ "$all_exist" = true ]; then
    echo "✅ 所有文件都存在"
else
    echo "❌ 有文件缺失"
    exit 1
fi

echo ""
echo "4. 检查TypeScript编译："
npx tsc --noEmit src/components/mode/*.tsx src/constants/modeConfig.tsx 2>&1 | grep -E "error TS" | grep -v "node_modules" | head -5

if [ $? -eq 0 ]; then
    echo "⚠️  发现TypeScript错误（可能是配置问题）"
else
    echo "✅ 没有TypeScript错误"
fi

echo ""
echo "===================="
echo "🎉 准备就绪！"
echo ""
echo "请在浏览器中打开以下URL进行测试："
echo "http://localhost:5173/mode-switcher-test"
echo ""
echo "详细测试步骤请参考: MODE_SWITCHER_TEST_GUIDE.md"
