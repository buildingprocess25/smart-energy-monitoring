const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('d:/Coding/sparta-energy/public/assets');
const destDir = path.resolve(__dirname, '../public/assets');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${file}`);
  }
} else {
  console.error(`Source directory not found: ${srcDir}`);
}
