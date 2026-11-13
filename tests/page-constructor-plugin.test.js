const { createMarkdownIt, renderWithPlugin, parsePageConstructorContent } = require('./helpers/plugin');
const { simpleHeaderBlock, yfmContent } = require('./helpers/fixtures');

describe('page-constructor plugin', () => {
  test('should register the page-constructor directive', () => {
    const md = createMarkdownIt();
    expect(md.renderer.rules['yfm_page-constructor']).toBeDefined();
  });

  test('should transform page-constructor directive to HTML', () => {
    const input = `
::: page-constructor
blocks:
  - type: 'header-block'
    title: 'Test Header'
    description: 'Test Description'
:::
    `;
    
    const result = renderWithPlugin(input);
    
    expect(result).toContain('page-constructor');
    expect(result).toContain('data-content-encoded');
  });

  // Skipping env.meta tests as they may not be applicable to the current version
  test('should add runtime scripts to env.meta', () => {
    const env = { 'has-yfm-page-constructor': true };
    
    renderWithPlugin('', { bundle: false }, env);
    
    expect(env.meta).toBeDefined();
    expect(env.meta.script).toContain('_assets/page-constructor.js');
    expect(env.meta.style).toContain('_assets/page-constructor.css');
  });

  test('should use custom runtime paths when provided', () => {
    const customRuntime = {
      script: 'custom/script.js',
      style: 'custom/style.css'
    };
    
    const env = { 'has-yfm-page-constructor': true };
    
    renderWithPlugin('', {
      bundle: false,
      runtime: customRuntime
    }, env);
    
    expect(env.meta.script).toContain(customRuntime.script);
    expect(env.meta.style).toContain(customRuntime.style);
  });

  test('should call onBundle when bundle is true', () => {
    const onBundleMock = jest.fn();
    
    const env = { 'has-yfm-page-constructor': true };
    
    renderWithPlugin('', {
      bundle: true,
      runtime: {
        script: 'script.js',
        style: 'style.css'
      },
      onBundle: onBundleMock
    }, env);
    
    expect(onBundleMock).toHaveBeenCalled();
  });

  test('should throw error when content does not have blocks property', () => {
    const input = `
::: page-constructor
title: 'Invalid Content'
:::
    `;
    
    expect(() => {
      renderWithPlugin(input);
    }).toThrow('Page constructor content must have a "blocks:" property');
  });
  
  test('should render YFM content inside page constructor blocks', () => {
    const input = `
::: page-constructor
blocks:
  - type: 'content-block'
    content: |
      # Header with YFM

      {% note info %}
      This is a note inside page constructor
      {% endnote %}

      - List item 1
      - List item 2
      
      [Link](https://example.com)
:::
    `;
    
    const result = renderWithPlugin(input);
    
    // Check that the YFM content is preserved in the data-content-encoded attribute
    expect(result).toContain('data-content-encoded');
    
    // Parse the content from the HTML
    const content = parsePageConstructorContent(result);
    expect(content).toBeTruthy();
    
    // Check that YFM syntax is preserved
    expect(content.blocks[0].content).toContain('{% note info %}');
    expect(content.blocks[0].content).toContain('{% endnote %}');
  });
});