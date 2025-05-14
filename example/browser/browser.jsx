import {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {
    transform as pageConstructorPlugin,
    ENV_FLAG_NAME,
} from '@diplodoc/page-constructor-extension/plugin';

import '@diplodoc/page-constructor-extension/runtime/style';

const transformConfig = {
    plugins: [pageConstructorPlugin({bundle: false}), notes],
};

const Content = ({html}) => <div dangerouslySetInnerHTML={{__html: html}} />;
// Pre-transform the content before rendering
const {result} = transform(README_CONTENT, transformConfig);
const initialHtml = result.html;

const App = ({}) => {
    const [content] = useState(initialHtml);

    useEffect(() => {
        if (result && result[ENV_FLAG_NAME]) {
            import('@diplodoc/page-constructor-extension/runtime')
                .then(({hydratePageConstructors}) => {
                    hydratePageConstructors();
                    console.log('Page constructors hydrated');
                })
                .catch((err) => console.error('Failed to import and hydrate:', err));
        }
    }, [result]);

    /*
TODO:
flushSync - Cannot be called during React rendering cycle, causes "flushSync called from lifecycle method" error
root.unmount() - Cannot unmount synchronously during rendering, causes race conditions
Hydration - Initial client render must match DOM structure, pre-transforming content prevents mismatch 

Problems only arise when the transform is called inside a component. Perhaps it should be remade into rendered templates for filling.
*/

    return <Content html={content} />;
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
