const { modifyPageConstructorLinks } = require('../../src/plugin/content-processing/link-resolver');

const assetLinkResolver = (link) => `/assets/${link}`;
const contentLinkResolver = (link) => `/content/${link}`;

function createTestData(blocks) {
  return { blocks };
}

function resolveLinks(data, options = {}) {
  const { useAssetResolver = true, useContentResolver = true } = options;
  
  return modifyPageConstructorLinks({
    data,
    getAssetLink: useAssetResolver ? assetLinkResolver : undefined,
    getContentLink: useContentResolver ? contentLinkResolver : undefined
  });
}

module.exports = {
  assetLinkResolver,
  contentLinkResolver,
  createTestData,
  resolveLinks
};