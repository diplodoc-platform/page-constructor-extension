const React = require('react');
const { renderToString } = require('react-dom/server');

function setupDom() {
  document.body.innerHTML = '';
  return document.body;
}

function createPageConstructorPlaceholder(content, id = 'test-id') {
  const placeholder = document.createElement('div');
  placeholder.className = 'yfm-page-constructor';
  placeholder.setAttribute('data-content-encoded', encodeURIComponent(JSON.stringify(content)));
  placeholder.setAttribute('data-pc-id', id);
  return placeholder;
}

function createPreRenderedPageConstructor(content, id = 'test-id') {
  const element = createPageConstructorPlaceholder(content, id);
  element.innerHTML = '<div>Pre-rendered content</div>';
  return element;
}

function resetModules() {
  jest.resetModules();
}

module.exports = {
  setupDom,
  createPageConstructorPlaceholder,
  createPreRenderedPageConstructor,
  resetModules,
};