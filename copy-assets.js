import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const expoWwwDir = path.join(rootDir, 'expo-shell', 'assets', 'www');

console.log('🚀 Starting Ronin Asset Bridging for Expo...');

try {
  // 1. Build the Vite Web project
  console.log('📦 Compiling Vite production assets (npm run build)...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

  // 2. Ensure target Expo directories exist
  console.log('📂 Preparing target Expo directory structure...');
  if (fs.existsSync(expoWwwDir)) {
    fs.rmSync(expoWwwDir, { recursive: true, force: true });
  }
  fs.mkdirSync(expoWwwDir, { recursive: true });

  // 3. Copy static web build to Expo assets
  console.log('🚚 Copying build assets from dist to expo-shell/assets/www...');
  fs.cpSync(distDir, expoWwwDir, { recursive: true });

  // 4. Strip type="module" to fix Android WebView local file CORS blocking
  const indexPath = path.join(expoWwwDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexHtml = fs.readFileSync(indexPath, 'utf-8');
    indexHtml = indexHtml.replace(/type="module" crossorigin/g, 'defer');
    indexHtml = indexHtml.replace(/type="module"/g, 'defer');
    indexHtml = indexHtml.replace(/<link rel="modulepreload"[^>]*>/g, '');
    
    // Completely destroy any leftover import.meta syntax (causes SyntaxError outside modules)
    indexHtml = indexHtml.replace(/import\.meta/g, '({url:""})');
    
    fs.writeFileSync(indexPath, indexHtml);
    console.log('🛠️ Stripped ES module tags and import.meta syntax from index.html for WebView compatibility.');
  }

  console.log('✨ Success! Assets successfully compiled and bridged to Expo shell.');
} catch (error) {
  console.error('❌ Failed during build and asset bridging:', error.message);
  process.exit(1);
}
