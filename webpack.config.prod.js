const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './resources/js/index.js',
  },
  output: {
    filename: 'js/index.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        /* additional options here */
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/app.css',
    }),
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
            // Extract CSS out of JS bundle
            loader: MiniCssExtractPlugin.loader,
            // Tell MiniCssExtractPlugin where to find dist folder so images are linked to correctly
            options: {
              publicPath: '../',
            },
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
