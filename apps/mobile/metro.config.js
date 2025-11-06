const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for WatermelonDB
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Resolve modules for WatermelonDB
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'sql'],
};

module.exports = config;
