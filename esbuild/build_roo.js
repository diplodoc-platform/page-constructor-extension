const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// Пути к файлам
const srcDir = path.resolve(__dirname, '../src_roo');
const distDir = path.resolve(__dirname, '../dist_roo');

// Создаем директорию dist_roo, если она не существует
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Сборка серверного бандла
console.log('Building server bundle...');
esbuild.buildSync({
    entryPoints: [path.resolve(srcDir, 'plugin/index-node_roo.ts')],
    bundle: true,
    platform: 'node',
    outfile: path.resolve(distDir, 'index-node.js'),
    external: ['react', 'react-dom', 'react-dom/server'],
    logLevel: 'info',
});

// Сборка клиентского бандла
console.log('Building client bundle...');
esbuild.buildSync({
    entryPoints: [path.resolve(srcDir, 'plugin/index_roo.ts')],
    bundle: true,
    platform: 'browser',
    outfile: path.resolve(distDir, 'react-components.js'),
    // Не исключаем React и ReactDOM, чтобы они были включены в бандл
    // external: ['react', 'react-dom'],
    format: 'iife',
    globalName: 'ReactComponents',
    logLevel: 'info',
    define: {
        // Определяем process.env.NODE_ENV для React
        'process.env.NODE_ENV': '"production"'
    },
    // Минифицируем код для уменьшения размера
    minify: true,
});

console.log('Build completed successfully!');