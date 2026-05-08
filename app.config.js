const isDev = process.env.APP_ENV === 'development';

module.exports = ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    bundleIdentifier: isDev
      ? 'com.womanownedwallet.summercamp.dev'
      : 'com.womanownedwallet.summercamp',
  },
  android: {
    ...config.android,
    softwareKeyboardLayoutMode: 'pan',
  },
});
