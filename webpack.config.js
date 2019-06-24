const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  mode: 'development',
  entry: {
    index: './resources/js/app.js'
  },
  output: {
    filename: 'js/app.js',
    path: path.resolve(__dirname, 'public')
  },
  devtool: 'source-map', // Generates source maps.
  plugins: [
    new WebpackNotifierPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/app.css'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
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
                    node: '10'
                  }
                }
              ],
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.(eot|ttf|woff)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                return file
                  .replace('fonts/', '')
                  .replace(
                    '/Users/jlwalker/Sites/bookable/node_modules/',
                    'fonts/vendor/'
                  );
              }
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            // Extract images and dump into img folder.
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            // Extract CSS out of JS bundle
            loader: MiniCssExtractPlugin.loader,
            // Tell MiniCssExtractPlugin where to find dist folder so images are linked to correctly
            options: {
              publicPath: '../'
            }
          },
          {
            // Parse CSS file.
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2
            }
          },
          {
            // Allows relative paths to be used in scss partials, instead of having to write them relative to the main style.scss which imports them.
            // Requires a sourceMap from all previous loaders in the chain.
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              // sourceMap required for resolve-url-loader
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
};
