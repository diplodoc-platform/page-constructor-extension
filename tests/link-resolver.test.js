const { createTestData, resolveLinks } = require('./helpers/link-resolver');

describe('link-resolver', () => {
  describe('modifyPageConstructorLinks', () => {
    test('should not modify non-local URLs', () => {
      const data = createTestData([
        {
          type: 'header-block',
          title: 'Test',
          image: 'https://example.com/image.png'
        }
      ]);
      
      const result = resolveLinks(data);
      
      expect(result.blocks[0].image).toBe('https://example.com/image.png');
    });
    
    test('should modify local media URLs with getAssetLink', () => {
      const data = createTestData([
        {
          type: 'header-block',
          title: 'Test',
          image: 'image.png'
        }
      ]);
      
      const result = resolveLinks(data);
      
      expect(result.blocks[0].image).toBe('/assets/image.png');
    });
    
    test('should modify local content URLs with getContentLink', () => {
      const data = createTestData([
        {
          type: 'link-block',
          title: 'Test',
          url: 'page.md'
        }
      ]);
      
      const result = resolveLinks(data);
      
      expect(result.blocks[0].url).toBe('/content/page.md');
    });
    
    test('should handle arrays of links', () => {
      const data = createTestData([
        {
          type: 'gallery-block',
          items: [
            { src: 'image1.png' },
            { src: 'image2.png' }
          ]
        }
      ]);
      
      const result = resolveLinks(data);
      
      expect(result.blocks[0].items[0].src).toBe('/assets/image1.png');
      expect(result.blocks[0].items[1].src).toBe('/assets/image2.png');
    });
    
    test('should handle nested objects', () => {
      const data = createTestData([
        {
          type: 'complex-block',
          content: {
            header: {
              image: 'header.png'
            },
            footer: {
              links: [
                { href: 'page1.md' },
                { href: 'page2.md' }
              ]
            }
          }
        }
      ]);
      
      const result = resolveLinks(data);
      
      expect(result.blocks[0].content.header.image).toBe('/assets/header.png');
      expect(result.blocks[0].content.footer.links[0].href).toBe('/content/page1.md');
      expect(result.blocks[0].content.footer.links[1].href).toBe('/content/page2.md');
    });
    
    test('should not modify links when resolvers are not provided', () => {
      const data = createTestData([
        {
          type: 'header-block',
          title: 'Test',
          image: 'image.png'
        },
        {
          type: 'link-block',
          url: 'page.md'
        }
      ]);
      
      const result = resolveLinks(data, { useAssetResolver: false, useContentResolver: false });
      
      expect(result.blocks[0].image).toBe('image.png');
      expect(result.blocks[1].url).toBe('page.md');
    });
  });
});