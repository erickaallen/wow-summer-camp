const { expo: base } = require('./app.json');

const isDev = process.env.APP_ENV === 'development';

module.exports = ({ config }) => ({
  ...base,
  ios: {
    ...base.ios,
    bundleIdentifier: isDev
      ? 'com.womanownedwallet.summercamp.dev'
      : 'com.womanownedwallet.summercamp',
  },
});
