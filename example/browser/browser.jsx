import {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import {
    transform as pageConstructorPlugin,
    PAGE_CONSTRUCTOR_RUNTIME,
} from '@diplodoc/page-constructor-extension/plugin';
import {PageConstructorRuntime} from '@diplodoc/page-constructor-extension/react';

const transformConfig = {
    plugins: [pageConstructorPlugin({bundle: false}), notes],
};

const Content = ({html}) => <div dangerouslySetInnerHTML={{__html: html}} />;

const App = ({}) => {
    const {result} = transform(README_CONTENT, transformConfig);
    const initialHtml = result.html;
    const [content] = useState(initialHtml);
    const [runtimeLoaded, setRuntimeLoaded] = useState(false);

    useEffect(() => {
        if (result.meta?.script?.includes(PAGE_CONSTRUCTOR_RUNTIME)) {
            Promise.all([
                import('@diplodoc/page-constructor-extension/runtime'),
                import('@diplodoc/page-constructor-extension/runtime/style')
            ]).then(() => {
                setRuntimeLoaded(true);
            });
        }
    }, [result.meta?.script]);

    return (
        <>
            <Content html={content} />
            {runtimeLoaded && <PageConstructorRuntime />}
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
