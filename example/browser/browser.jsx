import React from 'react';
import {createRoot} from 'react-dom/client';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {transform as pageConstructorPlugin, hydratePageConstructors} from '@diplodoc/page-constructor-extension/plugin';

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
        
        // Call hydratePageConstructors after the content is rendered
        // This will hydrate any page-constructor components in the content
        setTimeout(() => {
            hydratePageConstructors();
        }, 0);
    }, []);

    return (<Content html={content} />);
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Also hydrate any page-constructor components that are already in the DOM
// This ensures that components are hydrated even if they're not part of the React tree
if (typeof window !== 'undefined') {
    window.hydratePageConstructors = hydratePageConstructors
    // window.addEventListener('DOMContentLoaded', hydratePageConstructors);
}
