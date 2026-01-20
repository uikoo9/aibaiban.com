import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const logoSvg = path.join(publicDir, 'logo.svg');

// 要生成的 PNG 尺寸
const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'og-image.png', size: 1200 }, // OG 图片通常用 1200x630，但我们先生成正方形
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-16.png', size: 16 },
];

async function generatePNGs() {
  console.log('🎨 开始生成 PNG 图标...\n');

  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);

    try {
      await sharp(logoSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      console.log(`✅ ${name} (${size}x${size}) - ${(stats.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error(`❌ 生成 ${name} 失败:`, error.message);
    }
  }

  console.log('\n🎉 PNG 图标生成完成！');
  console.log('\n📝 下一步：生成 favicon.ico');
  console.log('运行: npx sharp-cli favicon-32.png favicon-16.png -o public/favicon.ico');
}

generatePNGs().catch(console.error);
