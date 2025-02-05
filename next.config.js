const webpack = require('webpack');
const path = require('path');

const nextConfig = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        THREE: 'three',
      })
    );
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      loader: 'shader-loader',
      options: {
        glsl: {
          chunkPath: path.resolve(__dirname, 'src/shaders/chunks'),
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;