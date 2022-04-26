const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { debug } = require('console');
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  mode: process.env.NODE_ENV, // 'development' // process.env.NODE_ENV
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, './'),
    },
    proxy: {
      '/': 'http://localhost:3000',
    },

    hot: true,
    open: true,
    compress: true,
    port: 8080,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.png|svg|jpg|gif$/,
        use: ['file-loader'],
      },
      {
        test: /\.css$/i,
        use: [
          // [style-loader](/loaders/style-loader)
          { loader: 'style-loader' },
          // [css-loader](/loaders/css-loader)
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          // [sass-loader](/loaders/sass-loader)
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack App',
      filename: 'index.html',
      template: 'template.html',
    }),
    // new BundleAnalyzerPlugin(),
  ],
  resolve: { extensions: ['.js', '.jsx'] },
};
