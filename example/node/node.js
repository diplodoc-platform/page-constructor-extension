import {readFile, writeFile, mkdir} from 'node:fs/promises';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {transform as pageConstructorPlugin} from '@diplodoc/page-constructor-extension/plugin';

async function generateHtml() {
    const markdown = await readFile('../README.md', 'utf8');
    const {result} = await transform(markdown, {
        plugins: [pageConstructorPlugin({ 
            bundle: true, 
            runtime: {
                script: '_assets/page-constructor.js',
                style: '_assets/page-constructor.css',
            } 
        }), notes],
    });

    // Extract styles and scripts from the transform result
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
        <title>Page Constructor Runtime Test</title>
        ${styleLinks}
    </head>
    <body class="yfm">
        <div id="root" class="yfm2">${result.html}</div>
        <script>
            // Initialize the page constructor runtime when scripts are loaded
            window.pageConstructorJsonp = window.pageConstructorJsonp || [];
            window.pageConstructorJsonp.push(function(api) {
                api.run();
            });
        </script>
        ${scriptLinks}
    </body>
</html>
    `;

    await mkdir('./build', {recursive: true});
    await writeFile('./index-node.html', html, 'utf8');
    console.log('✅ ./index-node.html успешно сгенерирован.');
}

generateHtml().catch(console.error);
