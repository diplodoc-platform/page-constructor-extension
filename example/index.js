import transform from '@diplodoc/transform';
import pageConstructor from '@diplodoc/page-constructor-extension';
import {readFile} from 'node:fs/promises';

(async () => {
    const content = await readFile('./README.md', 'utf8');
    const {result} = await transform(content, {
        output: './build',
        plugins: [pageConstructor.transform()],
    });

    const scripts = result.meta.script
        .map((script) => {
            return `<script src="${script}"></script>`;
        })
        .join('\n');

    const html = `
<html>
    <head>
        ${scripts}
        <script>
            window.mermaidJsonp = window.mermaidJsonp || [];
            window.mermaidJsonp.push(function(pageConstructor) {
                window.addEventListener('load', function() {
                    pageConstructor.initialize({ theme: 'forest' });
                    pageConstructor.run();
                });
            });
        </script>
    </head>
    <body style="background: #FFF">
        ${result.html}
    </body>
</html>
    `;

    // eslint-disable-next-line no-console
    console.log(html);
})();
