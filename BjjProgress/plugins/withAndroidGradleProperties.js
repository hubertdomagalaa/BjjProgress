const { withGradleProperties } = require('@expo/config-plugins');

const withAndroidGradleProperties = (config) => {
  return withGradleProperties(config, (config) => {
    config.modResults.push(
      {
        type: 'property',
        key: 'suppressKotlinVersionCompatibilityCheck',
        value: 'true',
      },
      {
        type: 'property',
        key: 'kotlin.version',
        value: '1.9.24',
      }
    );
    return config;
  });
};

module.exports = withAndroidGradleProperties;
