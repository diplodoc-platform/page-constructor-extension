import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {
    transform as pageConstructorPlugin,
} from '@diplodoc/page-constructor-extension/plugin';
import {PageConstructorRuntime} from '@diplodoc/page-constructor-extension/react';

import '@diplodoc/page-constructor-extension/runtime/style';

const transformConfig = {
    plugins: [pageConstructorPlugin({bundle: false}), notes],
};

const Content = ({html}) => <div dangerouslySetInnerHTML={{__html: html}} />;

const App = ({}) => {
    const {result} = transform(README_CONTENT, transformConfig);
    const initialHtml = result.html;
    const [content] = useState(initialHtml);

    return (
        <>
            <Content html={content} />
            <PageConstructorRuntime />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
