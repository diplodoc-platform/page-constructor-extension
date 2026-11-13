const cheerio = require('cheerio');
const { renderWithPlugin, parsePageConstructorContent, createPageConstructorContent } = require('./helpers/plugin');
const { simpleHeaderBlock, complexPage, markdownContent } = require('./helpers/fixtures');

describe('page-constructor integration tests', () => {
  test('should render simple header block correctly', () => {
    const input = createPageConstructorContent([simpleHeaderBlock]);
    const result = renderWithPlugin(input);
    
    // Use cheerio to parse the HTML
    const $ = cheerio.load(result);
    
    // Check structure
    expect($('.yfm-page-constructor').length).toBe(1);
    expect($('.yfm-page-constructor').attr('data-content-encoded')).toBeDefined();
    
    // Check content
    const content = parsePageConstructorContent(result);
    expect(content.blocks).toHaveLength(1);
    expect(content.blocks[0].type).toBe('header-block');
    expect(content.blocks[0].title).toBe('Test Header');
    expect(content.blocks[0].description).toContain('Test Description');
  });
  
  test('should render complex blocks with nested structure', () => {
    const input = `
::: page-constructor
blocks:
  - type: 'header-block'
    title: 'Main Header'
    description: 'Main Description'
  - type: 'cards-block'
    title: 'Cards Section'
    cards:
      - title: 'Card 1'
        text: 'Card 1 Description'
        url: 'https://example.com/1'
      - title: 'Card 2'
        text: 'Card 2 Description'
        url: 'https://example.com/2'
  - type: 'content-block'
    content: 'Some content text'
:::
    `;
    
    const result = renderWithPlugin(input);
    
    // Use cheerio to parse the HTML
    const $ = cheerio.load(result);
    
    // Check structure
    expect($('.yfm-page-constructor').length).toBe(1);
    
    // Check content
    const content = parsePageConstructorContent(result);
    expect(content.blocks).toHaveLength(3);
    
    // Check header block
    expect(content.blocks[0].type).toBe('header-block');
    expect(content.blocks[0].title).toBe('Main Header');
    
    // Check cards block
    expect(content.blocks[1].type).toBe('cards-block');
    expect(content.blocks[1].title).toBe('Cards Section');
    expect(content.blocks[1].cards).toHaveLength(2);
    expect(content.blocks[1].cards[0].title).toBe('Card 1');
    expect(content.blocks[1].cards[1].url).toBe('https://example.com/2');
    
    // Check content block
    expect(content.blocks[2].type).toBe('content-block');
    expect(content.blocks[2].content).toBe('Some content text');
  });
  
  test('should handle link resolvers correctly', () => {
    const input = `
::: page-constructor
blocks:
  - type: 'header-block'
    title: 'Test Header'
    image: 'header.png'
  - type: 'link-block'
    url: 'page.md'
:::
    `;
    
    const result = renderWithPlugin(input, {
      bundle: false,
      assetLinkResolver: (link) => `/assets/${link}`,
      contentLinkResolver: (link) => `/content/${link}`
    });
    
    // Check content
    const content = parsePageConstructorContent(result);
    
    // Check that links were resolved
    expect(content.blocks[0].image).toBe('/assets/header.png');
    expect(content.blocks[1].url).toBe('/content/page.md');
  });
  
  test('should match snapshot for complex page', () => {
    const input = createPageConstructorContent(complexPage.blocks);
    const result = renderWithPlugin(input);
    
    // Use cheerio to parse the HTML
    const $ = cheerio.load(result);
    
    // Check structure
    expect($('.yfm-page-constructor').length).toBe(1);
    
    // Check content
    const content = parsePageConstructorContent(result);
    
    // Verify all blocks are present
    expect(content.blocks).toHaveLength(4);
    expect(content.blocks[0].type).toBe('header-block');
    expect(content.blocks[1].type).toBe('features-block');
    expect(content.blocks[2].type).toBe('testimonials-block');
    expect(content.blocks[3].type).toBe('cta-block');
    
    // Check specific content details
    expect(content.blocks[0].buttons).toHaveLength(2);
    expect(content.blocks[1].features).toHaveLength(3);
    expect(content.blocks[2].testimonials).toHaveLength(2);
    expect(content.blocks[3].button.text).toBe('Sign Up Now');
    
    // Create a simplified HTML representation for snapshot testing
    const simplifiedHtml = {
      tagName: $('.yfm-page-constructor')[0].tagName.toLowerCase(),
      className: $('.yfm-page-constructor').attr('class'),
      dataAttributes: {
        'data-pc-id': $('.yfm-page-constructor').attr('data-pc-id'),
        'data-pc-content': content
      }
    };
    
    // Match against expected structure
    expect(simplifiedHtml).toMatchSnapshot();
  });
  
  test('should handle markdown content inside page constructor blocks', () => {
    const input = createPageConstructorContent([markdownContent]);
    const result = renderWithPlugin(input);
    
    // Check content
    const content = parsePageConstructorContent(result);
    
    // Check that markdown content is preserved
    expect(content.blocks[0].type).toBe('content-block');
    expect(content.blocks[0].content).toContain('# Markdown Header');
    expect(content.blocks[0].content).toContain('**bold**');
    expect(content.blocks[0].content).toContain('*italic*');
    expect(content.blocks[0].content).toContain('- List item');
    expect(content.blocks[0].content).toContain('[Link to example]');
  });
});