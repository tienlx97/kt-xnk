const babelConfig = require('./babel.config.js');

module.exports = {
  plugins: {
    '@stylexjs/postcss-plugin': {
      include: ['src/**/*.{js,jsx}'],
      babelConfig: {
        babelrc: false,
        parserOpts: { plugins: ['jsx'] },
        plugins: babelConfig.plugins,
      },
      useCSSLayers: true,
    },
    autoprefixer: {},
  },
};
