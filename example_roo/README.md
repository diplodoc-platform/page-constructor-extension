# Page Constructor Roo Example

This is an example of using the page-constructor-roo extension. It demonstrates how to use the extension to create a div with content and then render it in a PageConstructor component on the client side using a React hook.

## Running the example

To run the example, follow these steps:

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run br
   ```

3. Open your browser at http://localhost:3001

## How it works

The example uses the following components:

1. **Plugin**: The plugin transforms markdown content with page-constructor blocks into HTML divs with encoded content.
2. **Renderer**: The renderer creates the HTML divs with the encoded content.
3. **React Hook**: The React hook finds these divs and renders them using the PageConstructor component.

The flow is as follows:

1. Markdown content with page-constructor blocks is transformed using the plugin.
2. The plugin uses the renderer to create HTML divs with the encoded content.
3. The React hook finds these divs and renders them using the PageConstructor component.

## Example content

The example uses the following markdown content:

```markdown
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
```

This content is transformed into an HTML div with the encoded content, which is then rendered by the PageConstructor component.