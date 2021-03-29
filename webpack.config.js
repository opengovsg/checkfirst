/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SentryCliPlugin = require('@sentry/webpack-plugin')

const outputDirectory = 'build/client'
const srcDirectory = path.join(__dirname, 'src/client')

const requiredSentryEnvVar = [
  process.env.SENTRY_AUTH_TOKEN,
  process.env.FRONTEND_SENTRY_DSN,
  process.env.SENTRY_ORG,
  process.env.SENTRY_PROJECT,
  process.env.SENTRY_URL,
]

module.exports = () => {
  const jsBundle = {
    entry: ['babel-polyfill', path.join(srcDirectory, 'index.tsx')],
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: 'bundle.js',
      publicPath: '/',
      assetModuleFilename: 'assets/[name][ext]',
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
          type: 'asset/resource',
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
      new webpack.DefinePlugin({
        'process.env.GA_TRACKING_ID': JSON.stringify(
          process.env.GA_TRACKING_ID
        ),
        'process.env.FRONTEND_SENTRY_DSN': JSON.stringify(
          process.env.FRONTEND_SENTRY_DSN
        ),
      }),
    ],
  }

  const uploadSourcemapsToSentry = requiredSentryEnvVar.reduce((x, y) => x && y)
  if (uploadSourcemapsToSentry) {
    console.log(
      '\x1b[32m[webpack-sentry-sourcemaps] Build will include upload of sourcemaps to Sentry.\x1b[0m'
    )
    jsBundle.plugins.push(
      new SentryCliPlugin({
        // plugin automatically extracts ENV vars: https://docs.sentry.io/product/cli/configuration/
        include: '.',
        ignoreFile: '.gitignore',
        ignore: ['node_modules', 'webpack.config.js'],
        deploy: {
          env: process.env.SENTRY_ENVIRONMENT,
        },
      })
    )
  } else {
    console.log(
      '\x1b[33m[webpack-sentry-sourcemaps] Skipping upload of sourcemaps to Sentry because of missing env vars. Ignore this if it was intended.\x1b[0m'
    )
  }
  return [jsBundle]
}
