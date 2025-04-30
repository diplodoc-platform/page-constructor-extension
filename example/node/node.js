import {readFile, writeFile, mkdir} from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {transform as pageConstructorPlugin} from '@diplodoc/page-constructor-extension/plugin';

// CSS import removed - not needed for server-side rendering

async function generateHtml() {
    // Создаем директорию build, если она не существует
    await mkdir('./build', {recursive: true});
    
    const markdown = await readFile('../README.md', 'utf8');
    const {result} = await transform(markdown, {
        plugins: [
            // Настраиваем плагин с правильными параметрами для copyRuntime
            pageConstructorPlugin({ 
                bundle: true, // Включаем bundle для копирования runtime файлов
                enableHydration: true, // Включаем гидратацию
                runtime: {
                    script: 'build/index.js', // Путь к скрипту относительно output
                    style: 'build/index.css', // Путь к стилям относительно output
                }
            }, {
                output: path.resolve('./') // Указываем output директорию для copyRuntime
            }), 
            notes
        ],
    });

    // Extract styles and scripts from the transform result
    const styles = result.meta?.style || [];
    const scripts = result.meta?.script || [];
    const htmlBlocks = result.meta?.html || []; // Получаем HTML блоки (включая скрипт гидратации)

    // Create style and script links
    const styleLinks = styles.map(style => `<link rel="stylesheet" href="${style}">`).join('\n        ');
    const scriptLinks = scripts.map(script => `<script src="${script}" defer></script>`).join('\n        ');
    const htmlContent = htmlBlocks.join('\n        '); // Добавляем HTML блоки (скрипт гидратации)

    const html = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Test useRenderPageConstructorBlocks</title>
        ${styleLinks}
        
        <!-- Подключаем React и ReactDOM для гидратации -->
        <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        
    </head>
    <body>
        <div id="root" class="yfm">${result.html}</div>
        <script src="./build/test.js"></script>
        ${scriptLinks}
        
        <!-- Добавляем HTML блоки (скрипт гидратации) -->
        ${htmlContent}
        
        <!-- Скрипт для запуска гидратации -->
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Проверяем, что функция гидратации доступна
                if (typeof window.ReactComponents !== 'undefined' && 
                    typeof window.ReactComponents.hydratePageConstructors === 'function') {
                    console.log('Hydrating page constructors...');
                    window.ReactComponents.hydratePageConstructors();
                } else {
                    console.warn('Hydration function not found');
                }
            });
        </script>
    </body>
</html>
    `;

    await writeFile('./index-node.html', html, 'utf8');
    console.log('✅ ./index-node.html успешно сгенерирован с поддержкой гидратации.');
    console.log('✅ Стили скопированы в build/index.css через copyRuntime.');
}

generateHtml().catch(console.error);
