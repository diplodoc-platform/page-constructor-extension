/**
 * @jest-environment jsdom
 */

const React = require('react');
const { renderToString } = require('react-dom/server');
const {
  setupDom,
  createPageConstructorPlaceholder,
  createPreRenderedPageConstructor,
  resetModules
} = require('./helpers/runtime');
const { simpleHeaderBlock } = require('./helpers/fixtures');

describe('runtime', () => {
  let originalDocument;
  
  beforeEach(() => {
    // Save original document
    originalDocument = global.document;
    
    // Setup DOM environment
    setupDom();
    
    // Reset modules to ensure clean tests
    resetModules();
  });
  
  afterEach(() => {
    // Restore original document
    global.document = originalDocument;
  });
  
  test('should render page constructor elements', () => {
    // Create page constructor placeholder
    const placeholder = createPageConstructorPlaceholder({
      blocks: [simpleHeaderBlock]
    });
    document.body.appendChild(placeholder);
    
    // Import runtime
    const { renderPageConstructors } = require('../src/runtime');
    
    // Run the renderer
    renderPageConstructors();
    // Check if the placeholder was processed
    expect(placeholder.getAttribute('data-rendered')).toBe('true');
  });
  
  test('should hydrate pre-rendered page constructor elements', () => {
    // Create pre-rendered page constructor element
    const preRendered = createPreRenderedPageConstructor({
      blocks: [simpleHeaderBlock]
    });
    document.body.appendChild(preRendered);
    
    // Import runtime
    const { renderPageConstructors } = require('../src/runtime');
    
    // Run the renderer
    renderPageConstructors();
    
    // Check if the element was hydrated
    expect(preRendered.getAttribute('data-hydrated')).toBe('true');
  });
  
  test.skip('should create page constructor element', () => {
    const { createPageConstructorElement } = require('../src/renderer/page-constructor-element');
    
    const content = {
      blocks: [simpleHeaderBlock]
    };
    
    // Create element
    const element = createPageConstructorElement(content);
    
    // Render to string to test
    const html = renderToString(element);
    
    // Check if it contains expected content
    expect(html).toContain('page-constructor');
    expect(html).toContain('Test Header');
  });
});