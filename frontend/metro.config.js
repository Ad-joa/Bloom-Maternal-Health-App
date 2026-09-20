const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for ESM modules with specific extensions that packages like socket.io-client / engine.io-parser use
config.resolver.sourceExts.push('mjs', 'cjs');

module.exports = config;
