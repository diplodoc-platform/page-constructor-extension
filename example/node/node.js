import {readFile, writeFile, mkdir} from 'node:fs/promises';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {transform as pageConstructorPlugin} from '@diplodoc/page-constructor-extension/plugin';

// CSS import removed - not needed for server-side rendering

async function generateHtml() {
    const markdown = await readFile('../README.md', 'utf8');
    const {result} = await transform(markdown, {
        plugins: [pageConstructorPlugin({ bundle: true, runtime: {
            script: '_assets/bundle2.js',
            style: '_assets/bundle2.css',
        } }), notes],
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
        <title>Test useRenderPageConstructorBlocks</title>
        ${styleLinks}
    </head>
    <body class="yfm">
        <div id="root" class="yfm2">${result.html}</div>
        <script src="./build/bundle.js"></script>
        ${scriptLinks}
    </body>
</html>
    `;

    await mkdir('./build', {recursive: true});
    await writeFile('./index-node.html', html, 'utf8');
    console.log('✅ ./index-node.html успешно сгенерирован.');
}

generateHtml().catch(console.error);
