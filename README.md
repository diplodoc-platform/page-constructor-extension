# Page Constructor Extension

This extension allows you to use the Page Constructor component from Gravity UI in your Diplodoc documentation.

## Installation

```bash
npm install @diplodoc/page-constructor-extension
```

## Usage

```js
import transform from '@diplodoc/transform';
import { transform as pageConstructorPlugin } from '@diplodoc/page-constructor-extension/plugin';

const { result } = await transform(markdown, {
  plugins: [
    pageConstructorPlugin({
      // Plugin options
    })
  ]
});
```

## Plugin Options

The plugin accepts the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `runtime` | `string` or `{ script: string, style: string }` | `{ script: '_assets/page-constructor.js', style: '_assets/page-constructor.css' }` | Path to the runtime files |
| `bundle` | `boolean` | `true` | Whether to bundle the runtime files |
| `assetLinkResolver` | `(link: string) => string` | `undefined` | Function to resolve asset links in the content |
| `contentLinkResolver` | `(link: string) => string` | `undefined` | Function to resolve content links in the content |

### Link Resolvers

The `assetLinkResolver` and `contentLinkResolver` options allow you to customize how links are resolved in the page constructor content. These functions are called for each link in the content and should return the resolved link.

- `assetLinkResolver`: Called for links to assets (images, videos, etc.)
- `contentLinkResolver`: Called for links to content (markdown files, HTML files, etc.)

Example:

```js
pageConstructorPlugin({
  // Other options...
  assetLinkResolver: (link) => {
    // Add a prefix to asset links
    return link.startsWith('http') ? link : `/assets/${link}`;
  },
  contentLinkResolver: (link) => {
    // Convert .md links to .html
    return link.endsWith('.md') ? link.replace('.md', '.html') : link;
  }
})
```

## Example

See the `example` directory for a complete example of how to use this extension.
