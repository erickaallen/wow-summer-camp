const { withAndroidManifest } = require('@expo/config-plugins');

const REMOVE = [
  'android.permission.RECORD_AUDIO',
];

module.exports = (config) =>
  withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;

    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    const permissions = manifest['uses-permission'] ?? [];

    for (const name of REMOVE) {
      const existing = permissions.find((p) => p.$['android:name'] === name);
      if (existing) {
        existing.$['tools:node'] = 'remove';
      } else {
        permissions.push({ $: { 'android:name': name, 'tools:node': 'remove' } });
      }
    }

    manifest['uses-permission'] = permissions;
    return mod;
  });
