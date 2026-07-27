const MarkdownIt = require('markdown-it');
const pageConstructorPlugin = require('../../src/plugin').transform;
const cheerio = require('cheerio');

function createMarkdownIt(options = { bundle: false }) {
  const md = new MarkdownIt();
  md.use(pageConstructorPlugin(options));
  return md;
}

function renderWithPlugin(content, options = { bundle: false }, env = {}) {
  const md = createMarkdownIt(options);
  return md.render(content, env);
}

function parsePageConstructorContent(html) {
  const $ = cheerio.load(html);
  const pcElement = $('.yfm-page-constructor');
  
  if (pcElement.length === 0) {
    return null;
  }
  
  const contentAttr = pcElement.attr('data-content-encoded');
  if (!contentAttr) {
    return null;
  }
  
  try {
    return JSON.parse(decodeURIComponent(contentAttr));
  } catch (e) {
    return null;
  }
}

function createPageConstructorContent(blocks) {
  const blocksYaml = blocks.map(block => {
    const blockLines = Object.entries(block).map(([key, value]) => {
      if (typeof value === 'string') {
        return `    ${key}: '${value}'`;
      } else if (Array.isArray(value)) {
        const itemsYaml = value.map(item => {
          if (typeof item === 'string') {
            return `      - '${item}'`;
          } else if (typeof item === 'object') {
            const itemLines = Object.entries(item).map(([k, v]) => {
              return `        ${k}: '${v}'`;
            });
            return `      - \n${itemLines.join('\n')}`;
          }
          return `      - ${item}`;
        });
        return `    ${key}:\n${itemsYaml.join('\n')}`;
      } else if (typeof value === 'object') {
        const objLines = Object.entries(value).map(([k, v]) => {
          return `      ${k}: '${v}'`;
        });
        return `    ${key}:\n${objLines.join('\n')}`;
      }
      return `    ${key}: ${value}`;
    });
    
    return `  - type: '${block.type}'\n${blockLines.filter(line => !line.includes('type:')).join('\n')}`;
  });
  
  return `::: page-constructor\nblocks:\n${blocksYaml.join('\n')}\n:::`;
}

module.exports = {
  createMarkdownIt,
  renderWithPlugin,
  parsePageConstructorContent,
  createPageConstructorContent,
};