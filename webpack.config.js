/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const outputDirectory = 'build/client'
const srcDirectory = path.join(__dirname, 'src/client')

module.exports = () => {
  const jsBundle = {
    entry: ['babel-polyfill', path.join(srcDirectory, 'index.tsx')],
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: 'bundle.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
      alias: {
        '~': srcDirectory,
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets',
                name: '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    devServer: {
      port: 3000,
      proxy: {
        '/api': 'http://localhost:8080',
      },
      historyApiFallback: true,
      disableHostCheck: true,
    },
    devtool: 'source-map',
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './src/client/assets/logo.svg',
        chunksSortMode: 'none',
        meta: {
          // Open Graph protocol meta tags
          'og:title': 'CheckFirst',
          'og:type': 'website',
          'og:description': "Don't Know? CheckFirst.",
        },
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './src/client/assets', to: 'assets' }],
      }),
    ],
  }
  return [jsBundle]
}
