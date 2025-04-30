import React from 'react';
import { createRoot } from 'react-dom/client';
import transform from '@diplodoc/transform';
import notes from '@diplodoc/transform/lib/plugins/notes/index.js';
import { transform as pageConstructorPlugin, usePageConstructorRoo } from '../src_roo/index';

import '@gravity-ui/uikit/styles/styles.css';
import '@diplodoc/transform/dist/css/yfm.css';

// Sample markdown content with page constructor
const README_CONTENT = `
# Page Constructor Roo Example

This is an example of using the page constructor roo extension.

{% page-constructor %}
- type: grid
  children:
    - type: card
      title: Card 1
      text: This is card 1
    - type: card
      title: Card 2
      text: This is card 2
    - type: card
      title: Card 3
      text: This is card 3
{% endpage-constructor %}
`;

const transformConfig = {
    plugins: [pageConstructorPlugin({ bundle: false }), notes],
};

const Content = ({ html }) => (
    <div dangerouslySetInnerHTML={{ __html: html }} />
);

// Make the hook available globally for debugging
window.usePageConstructorRoo = usePageConstructorRoo;

const App = () => {
    const [content, setContent] = React.useState('');
    
    React.useEffect(() => {
        const { result } = transform(README_CONTENT, transformConfig);
        setContent(result.html);
        // Initialize the page constructor
        usePageConstructorRoo();
    }, []);

    return (
        <div>
            <h1>Page Constructor Roo Example</h1>
            <Content html={content} />
        </div>
    );
};

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<App />);
});