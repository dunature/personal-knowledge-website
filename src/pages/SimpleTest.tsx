/**
 * 简单测试页面
 */

import React from 'react';
import { Button } from '@/components/ui/Button';

export const SimpleTest: React.FC = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <h1 style={{ color: '#0047AB', fontSize: '32px', marginBottom: '20px' }}>
                简单测试页面
            </h1>
            <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px' }}>
                如果您能看到这段文字，说明React正常工作！
            </p>

            <div style={{ marginTop: '20px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>测试Button组件：</h2>
                <Button variant="primary" onClick={() => alert('按钮点击成功！')}>
                    点击测试
                </Button>
            </div>
        </div>
    );
};
