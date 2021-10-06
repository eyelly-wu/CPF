/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = (arg) => {
  const { dev } = arg
  const isProd = !dev
  const addedPlugins = isProd ? [] : [new webpack.HotModuleReplacementPlugin()]

  return {
    devServer: {
      port: 12315,
      open: false,
      hot: true,
      historyApiFallback: {
        verbose: true,
      },
    },
    mode: 'development',
    devtool: 'source-map',
    entry: {
      main: './src/index.tsx',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.scss'],
      alias: {
        '@/utils': path.resolve(__dirname, 'packages/utils'),
      },
    },
    module: {
      rules: [
        {
          test: /.s?css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: /.scss$/,
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          use: ['file-loader'],
        },
        {
          test: /\.(j|t)s(x?)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/preset-react', '@babel/typescript'],
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV_TEST__: dev,
        __DEV__: true,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      ...addedPlugins,
    ],
  }
}
