# Page Constructor Roo

This is a simplified version of the page-constructor plugin that creates a div with content and renders it in a PageConstructor component on the client side using a React hook.

## Usage

### Plugin

```js
import { transform as pageConstructorPlugin } from '@diplodoc/page-constructor-extension/roo';
import transform from '@diplodoc/transform';

const transformConfig = {
    plugins: [pageConstructorPlugin({ bundle: false })],
};

const { result } = transform(markdownContent, transformConfig);
```

### React Hook

```jsx
import { usePageConstructorRoo } from '@diplodoc/page-constructor-extension/roo/react';

function App() {
    // Initialize the page constructor
    usePageConstructorRoo();
    
    return (
        <div>
            {/* The content will be rendered here */}
        </div>
    );
}
```

## Building

To build the plugin, run:

```bash
npm run build:roo
```

## Example

See the `example_roo` directory for a complete example of how to use the plugin.

```bash
cd example_roo
npm install
npm start
```

Then open your browser at http://localhost:3001