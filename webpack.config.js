const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './resources/js/index.js',
  },
  output: {
    filename: 'js/index.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  devtool: 'source-map', // Generates source maps.
  plugins: [
    new WebpackNotifierPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['js', 'css', 'images'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        // Do not process node_module files with babel, as it slows down bundling and they should be already processed anyway.
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: '10',
                  },
                },
              ],
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            // Extract images and dump into img folder.
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            // Inject CSS into DOM from JS bundle.
            loader: 'style-loader',
          },
          {
            // Parse CSS file.
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            // Allows relative paths to be used in scss partials, instead of having to write them relative to the main style.scss which imports them.
            // Requires a sourceMap from all previous loaders in the chain.
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // sourceMap required for resolve-url-loader
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
