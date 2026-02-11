// Mock TextEncoder/TextDecoder for Node.js environment
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Mock matchMedia for tests
if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() {
        return false;
      }
    };
  };
} else {
  global.matchMedia = () => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    };
  };
}

// Mock console.error to avoid React warnings in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out React warnings that we expect in tests
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: React.createElement:') ||
     args[0].includes('Warning: Invalid DOM property') ||
     args[0].includes('Warning: Unknown prop'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Add custom matchers if needed
expect.extend({
  // Example custom matcher
  toBeValidPageConstructorContent(received) {
    const pass =
      received &&
      typeof received === 'object' &&
      Array.isArray(received.blocks);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be valid page constructor content`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be valid page constructor content`,
        pass: false,
      };
    }
  },
});