import React from 'react';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {transform as pageConstructorPlugin} from '@diplodoc/page-constructor-extension/plugin';
import {usePageConstructor} from '@diplodoc/page-constructor-extension/react';
import {createRoot} from 'react-dom/client';

import '@gravity-ui/uikit/styles/styles.css';
import '@diplodoc/transform/dist/css/yfm.css';
// import '@diplodoc/page-constructor-extension/index.scss';

const transformConfig = {
    plugins: [pageConstructorPlugin({bundle: false}), notes],
};

const Content = ({html}) => (
    <div dangerouslySetInnerHTML={{__html: html}} />
);

window.usePageConstructor = usePageConstructor
    console.log(typeof usePageConstructor, 'dfdd')
const App = ({}) => {
    const [content, setContent] = React.useState('');
    const [isTransformComplete, setIsTransformComplete] = React.useState(false);
    
    React.useEffect(() => {
        const {result} = transform(README_CONTENT, transformConfig);
        setContent(result.html);
        setIsTransformComplete(true);
    }, []);
    
    usePageConstructor();

    return (<Content html={content} />);
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
