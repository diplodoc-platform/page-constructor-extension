# Page Constructor Extension Example

This example demonstrates how to use the Page Constructor extension in Diplodoc documentation.

## Getting Started

Install dependencies and start the example:

```bash
npm i
npm start
```

This will render the documentation using [@diplodoc/transform](https://github.com/diplodoc-platform/transform) and open it in your default browser.

## Example Structure

This example includes:

- **Browser Example**: Shows how to use the Page Constructor extension in a browser environment
  - `browser/browser.jsx`: Main entry point for the browser example
  - `browser/build.js`: Build script for the browser example
  - `browser/index-browser.html`: HTML template for the browser example

- **Node Example**: Shows how to use the Page Constructor extension in a Node.js environment
  - `node/node.js`: Example of using the extension in Node.js
  - `node/example.css`: Styles for the Node.js example

## Page Constructor Usage

The example demonstrates various Page Constructor blocks:

### Header Block

```markdown
::: page-constructor
blocks:
  - type: 'header-block'
    width: 's'
    offset: 'default'
    title: 'Diplodoc'
    resetPaddings: true
    verticalOffset: 'l'
    description: 'Platform description'
    background:
      light:
        image:
          mobile: '../_images/cover.png'
          desktop: 'https://example.com/image.png'
        color: '#C6FE4D'
      dark:
        image:
          mobile: '../_images/cover-dark.png'
          desktop: 'https://example.com/image-dark.png'
        color: '#C6FE4D'
    buttons:
      - text: 'Get Started'
        theme: 'outlined'
        url: '/'
:::
```

### Extended Features Block

```markdown
::: page-constructor
blocks:
  - type: 'extended-features-block'
    title:
      text: 'Platform Benefits'
    items:
      - title: 'Easy to Use'
        icon: 'https://example.com/icon1.svg'
        text: 'Work with documents as code in a familiar environment.'
      - title: 'Fast Performance'
        icon: 'https://example.com/icon2.svg'
        text: 'Quick build, validation, and deployment of documentation of any size.'
:::
```

### Filter Block

```markdown
::: page-constructor
blocks:
  - type: 'filter-block'
    centered: true
    title:
      text: 'Trusted By'
    tags:
      - id: 'one'
        label: 'Company One'
      - id: 'two'
        label: 'Company Two'
    items:
      - tags:
          - 'one'
        card:
          type: 'layout-item'
          media:
            image: 'https://example.com/image1.png'
          content:
            links:
              - text: 'View Documentation'
                url: 'https://example.com/docs'
:::
```

## Customization

You can customize the Page Constructor blocks by modifying the YAML content in the page-constructor directive. See the [Page Constructor documentation](https://github.com/gravity-ui/page-constructor) for more information on available block types and their properties.
