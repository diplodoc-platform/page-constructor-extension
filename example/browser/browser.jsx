import {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {transform as pageConstructorPlugin} from '@diplodoc/page-constructor-extension/plugin';
import {hydratePageConstructors} from '@diplodoc/page-constructor-extension/runtime';

import '@diplodoc/page-constructor-extension/runtime/style';

const transformConfig = {
    plugins: [pageConstructorPlugin({bundle: false}), notes],
};

const Content = ({html}) => <div dangerouslySetInnerHTML={{__html: html}} />;
// Pre-transform the content before rendering
const {result} = transform(README_CONTENT, transformConfig);
const initialHtml = result.html;

const App = ({}) => {
    const [content, setContent] = useState(initialHtml);

    useEffect(() => {
        hydratePageConstructors();
    }, []);

    /*
flushSync - Cannot be called during React rendering cycle, causes "flushSync called from lifecycle method" error
root.unmount() - Cannot unmount synchronously during rendering, causes race conditions
Hydration - Initial client render must match DOM structure, pre-transforming content prevents mismatch 

This is an artificial scenario here. Perhaps it should be remade into rendered templates for filling.
*/

    return <Content html={content} />;
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
