import {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {transform as pageConstructorPlugin} from '@diplodoc/page-constructor-extension/plugin';
import {setupPageConstructorObserver} from '@diplodoc/page-constructor-extension/runtime';

// import '@gravity-ui/uikit/styles/styles.css';
// import '@diplodoc/transform/dist/css/yfm.css';
// import '@gravity-ui/page-constructor/styles/styles.scss';

import '@diplodoc/page-constructor-extension/runtime/style';

const transformConfig = {
    plugins: [pageConstructorPlugin({bundle: false}), notes],
};

const Content = ({html}) => <div dangerouslySetInnerHTML={{__html: html}} />;

const App = ({}) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const {result} = transform(README_CONTENT, transformConfig);

        setContent(result.html);

        setupPageConstructorObserver();
    }, []);

    return <Content html={content} />;
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
