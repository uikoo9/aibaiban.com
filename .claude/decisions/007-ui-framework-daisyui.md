# ADR 007: 切换 UI 框架到 DaisyUI

## 状态
✅ 已接受 (2026-01-19)

## 背景
在 ADR 006 中，我们选择了 shadcn/ui 作为 UI 组件库。但在实际开发过程中遇到了以下问题：

1. **主题切换复杂**
   - Tailwind CSS v4 的主题系统与 shadcn/ui 的兼容性问题
   - 自定义主题需要大量的 CSS 变量配置和覆盖规则
   - 主题切换功能实现困难，CSS 变量更新无法正确生效

2. **shadcn/ui 的特性**
   - 基于复制组件代码到项目的方式，适合高度定制化
   - 但对于我们的项目，标准化组件已经足够
   - 主题系统不够完善，需要自己实现

3. **项目需求**
   - 需要多主题支持，方便用户切换
   - 需要快速开发，不想花太多时间在 UI 细节上
   - 希望使用语义化的类名，代码更清晰

## 决策
切换到 **DaisyUI** 作为 UI 组件库。

## 理由

### 为什么选择 DaisyUI？

1. **完善的主题系统**
   - 内置 35+ 主题，开箱即用
   - 使用 `data-theme` 属性即可切换主题
   - 支持自定义主题，配置简单（通过 CSS）

2. **语义化类名**
   - `btn btn-primary` 比 `px-4 py-2 bg-blue-500...` 更清晰
   - 代码可读性和维护性更好
   - HTML 体积减少约 79%

3. **完美兼容 Tailwind CSS v4**
   - DaisyUI 5 专为 Tailwind v4 设计
   - 配置极简：只需 `@plugin "daisyui";`
   - 不需要 `tailwind.config.js` 文件

4. **纯 CSS 实现**
   - 无 JavaScript 依赖，性能更好
   - 与任何 JS 框架兼容
   - 打包体积更小

5. **开发效率高**
   - 组件直接使用，无需复制代码
   - 类名简洁，开发速度快
   - 文档完善，有 LLM 优化的文档

### 与 shadcn/ui 的对比

| 特性 | DaisyUI | shadcn/ui |
|------|---------|-----------|
| 安装方式 | npm 包 | 复制组件代码 |
| 使用方式 | 类名 | 组件导入 |
| 主题系统 | 内置 35+ 主题 | 需要自己实现 |
| 代码量 | 少（类名） | 多（组件代码） |
| 定制化 | 通过工具类 | 完全控制代码 |
| 学习成本 | 低（学类名） | 中（学组件） |
| 适合场景 | 标准化 UI | 高度定制 |

### 为什么不继续用 shadcn/ui？

1. 主题切换实现复杂，与 Tailwind v4 兼容性不佳
2. 对于标准化的白板工具，不需要极度定制的 UI
3. 复制组件代码的方式增加了项目代码量
4. 需要自己维护组件代码和样式

## 实施步骤

1. ✅ 安装 DaisyUI: `pnpm add -D daisyui@latest --filter @aibaiban/web`
2. ✅ 更新 `src/index.css`: 添加 `@plugin "daisyui";`
3. ✅ 删除 shadcn/ui 相关文件:
   - `components.json`
   - `src/components/ThemeSwitcher.tsx`
   - `src/hooks/useTheme.ts`
   - `src/lib/themes.ts`
4. ✅ 更新组件代码使用 DaisyUI 类名

## 影响

### 积极影响
- 主题切换功能开箱即用
- 代码更简洁，可读性更好
- 开发速度更快
- HTML 体积减少约 79%
- 无需维护组件代码

### 需要注意
- 团队成员需要学习 DaisyUI 类名（学习成本低）
- 如果后续需要高度定制的组件，可以结合 Tailwind 工具类
- 保留 `src/lib/utils.ts` 的 `cn` 函数，以便在需要时合并类名

## 相关资源
- [DaisyUI 官网](https://daisyui.com/)
- [DaisyUI 5 文档](https://daisyui.com/docs/)
- [DaisyUI 主题生成器](https://daisyui.com/theme-generator/)
- [DaisyUI LLM 文档](https://daisyui.com/llms.txt)

## 参与者
- Vincent (项目负责人)
- Claude Code (AI 辅助开发)

## 更新记录
- 2026-01-19: 创建决策文档，完成切换
