import toIco from 'to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');

async function generateFavicon() {
  console.log('🎨 开始生成 favicon.ico...\n');

  try {
    // 读取 PNG 文件
    const icon16 = fs.readFileSync(path.join(publicDir, 'favicon-16.png'));
    const icon32 = fs.readFileSync(path.join(publicDir, 'favicon-32.png'));

    // 生成 ICO 文件（包含 16x16 和 32x32）
    const icoBuffer = await toIco([icon16, icon32]);

    // 保存到 public 目录
    const outputPath = path.join(publicDir, 'favicon.ico');
    fs.writeFileSync(outputPath, icoBuffer);

    const stats = fs.statSync(outputPath);
    console.log(`✅ favicon.ico 生成成功 - ${(stats.size / 1024).toFixed(1)}KB`);

    console.log('\n🎉 所有图标文件生成完成！\n');
    console.log('📁 生成的文件：');
    console.log('  - public/icon-192.png');
    console.log('  - public/icon-512.png');
    console.log('  - public/apple-touch-icon.png');
    console.log('  - public/og-image.png');
    console.log('  - public/favicon-32.png');
    console.log('  - public/favicon-16.png');
    console.log('  - public/favicon.ico ⭐');
  } catch (error) {
    console.error('❌ 生成 favicon.ico 失败:', error.message);
  }
}

generateFavicon().catch(console.error);
