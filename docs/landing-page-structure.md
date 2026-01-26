# 落地页结构说明

> 最后更新：2026-01-26

## 概述

项目采用静态 HTML 作为落地页（index.html），React 应用作为白板工具（board.html）。

## 页面架构

### index.html - 静态落地页

**路由**：`/`（首页）

**用途**：
- SEO 优化的营销页面
- 向用户介绍产品核心功能
- 引导用户进入白板应用

**技术栈**：
- 纯 HTML + Tailwind CSS CDN
- 无 JavaScript 框架依赖
- 完整的 SEO meta 标签和结构化数据

**页面结构**：
```
1. Hero Section（半屏高度，垂直居中）
   - 新一代 AI 白板工具标签
   - 大标题："AI 白板"
   - 副标题：产品价值主张
   - CTA 按钮：跳转到 /board

2. Bento Grid 特性展示（3 个卡片）
   - AI 智能生成（大卡片，4列2行）
   - 实时协作（小卡片，2列）
   - 简单易用（小卡片，2列）

3. 统计数据展示（4 个卡片）
   - 1M+ 用户
   - 10M+ 图表
   - 50+ 国家
   - 99.9% 可用性

4. SEO 关键词区域（隐藏）
   - sr-only 样式，对搜索引擎可见
   - 包含完整的关键词列表

5. Footer
   - 版权信息
```

**SEO 优化**：
- ✅ 完整的 meta 标签（title, description, keywords）
- ✅ Open Graph 标签（Facebook）
- ✅ Twitter Card 标签
- ✅ JSON-LD 结构化数据（Schema.org SoftwareApplication）
- ✅ 语义化 HTML 标签
- ✅ 隐藏的 SEO 关键词区域

### board.html - 白板应用入口

**路由**：`/board`（由用户处理路由配置）

**用途**：
- React 应用入口
- 白板工具主界面

**技术栈**：
- React 19.2.3 + TypeScript
- Ant Design 6.2.1
- Excalidraw 0.18.0

**内容**：
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <!-- 完整的 SEO meta 标签 -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## 路由配置

用户需要在服务器或构建配置中处理以下路由：

- `/` → `index.html`（静态落地页）
- `/board` → `board.html`（白板应用）

## 设计决策

### 为什么使用静态 HTML 作为落地页？

1. **SEO 优化**：
   - 无需等待 JavaScript 加载，搜索引擎可以直接抓取内容
   - 更快的首屏渲染时间（FCP）
   - 更好的搜索引擎排名

2. **性能优势**：
   - 无框架依赖，加载速度极快
   - 使用 Tailwind CSS CDN，简化构建流程
   - 减少 bundle 大小

3. **分离关注点**：
   - 营销页面和应用功能独立
   - 落地页更新不影响应用代码
   - 便于 A/B 测试和迭代

### 为什么 Hero 区域采用半屏高度？

1. **视觉冲击力**：大标题和 CTA 按钮在视口中央，第一眼就能看到
2. **引导用户滚动**：用户可以看到下方还有内容，鼓励继续探索
3. **简洁美观**：上下留白，不会显得拥挤

### 为什么移除部分特性卡片？

1. **聚焦核心价值**：只展示最重要的 3 个特性（AI 生成、实时协作、简单易用）
2. **避免信息过载**：太多卡片会分散用户注意力
3. **优化转化率**：简化页面，引导用户快速点击 CTA

## 关键文件

- `index.html` - 落地页
- `board.html` - 白板应用入口
- `src/main.tsx` - React 应用入口
- `src/pages/BoardAntd.tsx` - 白板主页面
- `src/App.tsx` - 应用路由配置

## 开发注意事项

1. **落地页修改**：直接编辑 `index.html`，无需构建
2. **白板应用修改**：编辑 React 组件，运行 `npm run build` 构建
3. **路由配置**：确保服务器正确处理 `/board` 路由
4. **SEO 更新**：修改 meta 标签时，同时更新 `index.html` 和 `board.html`

## 未来优化方向

- [ ] 添加动画效果（CSS animations）
- [ ] 优化移动端体验
- [ ] 添加更多 SEO 结构化数据
- [ ] A/B 测试不同的 CTA 文案
- [ ] 添加用户评价/案例展示
- [ ] 集成分析工具（Google Analytics, etc.）

---

**维护者**：Vincent
**版本**：1.0.0
