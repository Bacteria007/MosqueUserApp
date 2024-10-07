module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    // ['@babel/plugin-proposal-class-properties', { loose: false }],
    // ['@babel/plugin-proposal-private-methods', { loose: false }],
    // ['@babel/plugin-proposal-private-property-in-object', { loose: false }],
    'react-native-reanimated/plugin',
  ],
};
