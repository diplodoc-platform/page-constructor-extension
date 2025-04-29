import React from 'react';
import {createRoot} from 'react-dom/client';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {transform as pageConstructorPlugin} from '@diplodoc/page-constructor-extension/plugin';

// import {PageConstructor} from '@gravity-ui/page-constructor';

import '@gravity-ui/uikit/styles/styles.css';
import '@diplodoc/transform/dist/css/yfm.css';
import '@diplodoc/page-constructor-extension/plugin/style';
import '@gravity-ui/page-constructor/styles/styles.scss';

const transformConfig = {
    plugins: [pageConstructorPlugin({bundle: false}), notes],
};

const Content = ({html}) => (
    <div dangerouslySetInnerHTML={{__html: html}} />
);

const App = ({}) => {
    const [content, setContent] = React.useState('');
    
    React.useEffect(() => {
        const {result} = transform(README_CONTENT, transformConfig);
        setContent(result.html);
    }, []);

    return (<Content html={content} />);
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
