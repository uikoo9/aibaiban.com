# Public Assets

## 🎨 Logo 和图标文件

### 源文件
- `logo.svg` - 主 Logo (512x512，SVG 格式)

### PNG 图标（已生成）
- `icon-192.png` - PWA 图标 192x192
- `icon-512.png` - PWA 图标 512x512
- `apple-touch-icon.png` - iOS 主屏幕图标 180x180
- `og-image.png` - 社交分享预览图 1200x1200
- `favicon-16.png` - Favicon 16x16
- `favicon-32.png` - Favicon 32x32
- `favicon.ico` - 浏览器标签页图标（包含 16x16 和 32x32）

### SVG 图标（保留作为备份）
- `icon-192.svg` - SVG 版本（与 logo.svg 相同）
- `icon-512.svg` - SVG 版本（与 logo.svg 相同）
- `apple-touch-icon.svg` - SVG 版本（与 logo.svg 相同）
- `og-image.svg` - SVG 版本（与 logo.svg 相同）

### 其他文件
- `manifest.json` - PWA 配置文件
- `robots.txt` - 搜索引擎爬虫规则

---

## 🔧 重新生成图标

如果修改了 `logo.svg`，运行以下命令重新生成所有 PNG 图标：

```bash
# 生成 PNG 图标
node scripts/generate-icons.js

# 生成 favicon.ico
node scripts/generate-favicon.js
```

或者一次性生成所有图标：

```bash
npm run generate-icons
```

---

## 📐 Logo 设计规范

- **尺寸**: 512x512px（正方形）
- **Logo 占比**: 90%（460x460px，边距 26px）
- **配色**: 
  - Primary: #2563EB (Trust Blue)
  - Background: #FFFFFF (白色)
- **元素**: 
  - 白板框：白色填充 + 蓝色边框（12px）
  - AI 文字：270px，粗体，蓝色
- **圆角**: 32px

---

## ✅ 文件引用位置

### index.html
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/svg+xml" href="/logo.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta property="og:image" content="https://aibaiban.com/og-image.png" />
```

### manifest.json
```json
{
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

**更新时间**: 2026-01-20
