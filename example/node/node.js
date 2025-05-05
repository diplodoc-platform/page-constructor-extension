import {readFile, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {transform as pageConstructorPlugin} from '@diplodoc/page-constructor-extension/plugin';

async function generateHtml() {
    // Создаем директорию build, если она не существует
    await mkdir('./build', {recursive: true});
    
    const markdown = await readFile('../README.md', 'utf8');
    const {result} = await transform(markdown, {
        plugins: [
            // Настраиваем плагин с правильными параметрами для copyRuntime
            pageConstructorPlugin({
                bundle: true, // Включаем bundle для копирования runtime файлов
                runtime: {
                    script: 'build/index.js', // Путь к скрипту относительно output
                    style: 'build/index.css', // Путь к стилям относительно output
                },
                // // Пример использования пользовательских резолверов ссылок
                // assetLinkResolver: (link) => {
                //     console.log('Resolving asset link:', link);
                //     // Пример: добавляем префикс к ссылкам на ассеты
                //     return link.startsWith('http') ? link : `/assets/${link}`;
                // },
                // contentLinkResolver: (link) => {
                //     console.log('Resolving content link:', link);
                //     // Пример: преобразуем .md ссылки в .html
                //     return link.endsWith('.md') ? link.replace('.md', '.html') : link;
                // }
            }, {
                output: path.resolve('./') // Указываем output директорию для copyRuntime
            }), 
            notes
        ],
    });

    // Extract styles and scripts from the transform result
    console.log(result.meta,'333111');
    const styles = result.meta?.style || [];
    const scripts = result.meta?.script || [];

    // Create style and script links
    const styleLinks = styles.map(style => `<link rel="stylesheet" href="${style}">`).join('\n        ');
    const scriptLinks = scripts.map(script => `<script src="${script}"></script>`).join('\n        ');

    const html = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Test useRenderPageConstructorBlocks</title>
        ${styleLinks}
        <link rel="stylesheet" href="example.css">
    </head>
    <body>
        <div id="root" class="yfm">${result.html}</div>
        
        <!-- Скрипт для запуска гидратации -->
        ${scriptLinks}
    </body>
</html>
    `;

    await writeFile('./index-node.html', html, 'utf8');
    console.log('✅ ./index-node.html успешно сгенерирован с поддержкой гидратации.');
    console.log('✅ Стили скопированы в build/index.css через copyRuntime.');
}

generateHtml().catch(console.error);
