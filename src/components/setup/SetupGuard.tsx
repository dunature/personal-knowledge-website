/**
 * 配置守卫组件
 * 简化版本 - 不再自动跳转到配置向导
 * 用户通过点击头像的 ModeSwitcherModal 来登录
 */

interface SetupGuardProps {
    children: React.ReactNode;
}

export function SetupGuard({ children }: SetupGuardProps) {
    // 直接渲染子组件，不做任何检查
    // 登录流程完全通过 ModeSwitcherModal 处理
    return <>{children}</>;
}
