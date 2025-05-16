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

const App = ({}) => {
    const {result} = transform(README_CONTENT, transformConfig);
    const initialHtml = result.html;
    const [content] = useState(initialHtml);

    useEffect(() => {
        if (result && result[ENV_FLAG_NAME]) {
            import('@diplodoc/page-constructor-extension/runtime')
                .then(({renderPageConstructors}) => {
                    renderPageConstructors();
                    console.log('Page constructors hydrated');
                })
                .catch((err) => console.error('Failed to import and hydrate:', err));
        }
    }, [result]);

    return <Content html={content} />;
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
