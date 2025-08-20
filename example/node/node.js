import {readFile, writeFile, copyFile} from 'node:fs/promises';
import path from 'node:path';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import term from '@diplodoc/transform/lib/plugins/term/index.js';
import {transform as pageConstructorPlugin} from '@diplodoc/page-constructor-extension/plugin';

copyFile('../build/runtime/index.js.map', './build/index.js.map')
copyFile('../node_modules/@diplodoc/transform/dist/css/yfm.css', './build/transform.css')
copyFile('../node_modules/@diplodoc/transform/dist/js/yfm.js', './build/transform.js')

async function generateHtml() {
    const markdown = await readFile('./README.md', 'utf8');
    const {result} = await transform(markdown, {
        plugins: [
            pageConstructorPlugin(
                {
                    bundle: true,
                    runtime: {
                        script: 'build/index.js',
                        style: 'build/index.css',
                    },
                },
                {
                    output: path.resolve('./'),
                },
            ),
            notes,
            term
        ],
    });

    const styles = result.meta?.style || [];
    const scripts = result.meta?.script || [];

    const styleLinks = styles
        .map((style) => `<link rel="stylesheet" href="../${style}">`)
        .join('\n        ');
    const scriptLinks = scripts
        .map((script) => `<script src="../${script}" type="module"></script>`)
        .join('\n        ');

    const html = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Test useRenderPageConstructorBlocks</title>
        ${styleLinks}
        <link rel="stylesheet" href="example.css">
        <link rel="stylesheet" href="../build/transform.css">
    </head>
    <body>
        <div id="root" class="yfm">${result.html}</div>

        <!-- Скрипт для запуска гидратации (автоматически инициализирует рантайм) -->
        ${scriptLinks}
        <script src="../build/transform.js" type="module"></script>
    </body>
</html>
    `;

    await writeFile('./node/index-node.html', html, 'utf8');
    console.log('✅ ./index-node.html успешно сгенерирован с поддержкой гидратации.');
    console.log('✅ Стили скопированы в build/index.css через copyRuntime.');
}

generateHtml().catch(console.error);
