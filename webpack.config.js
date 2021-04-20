'use strict';
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, args = {}) => {
  const { mode = 'development' } = args;
  
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  const getStyleLoaders = () => {
    return [
      isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: { sourceMap: isDevelopment },
      },
    ];
  };
  const getPlugins = () => {
    const plugins = [
      new CleanWebpackPlugin({
        dangerouslyAllowCleanPatternsOutsideProject: true,
      }),
      new webpack.ProgressPlugin(),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      new HtmlWebpackPlugin({
        getData: () => {
          try {
            return JSON.parse(
              fs.readFileSync(
                `${path.resolve(__dirname, 'demo')}/data.json`,
                'utf8'
              )
            );
          } catch (e) {
            console.warn(`data.json was not provided`);
            return {};
          }
        },
        template: './demo/index.pug',
        filename: 'index.html',
        alwaysWriteToDisk: true,
        inject: true,
        hash: true,
        alwaysWriteToDisk: true,
        meta: {
          'msapplication-TileColor': '#da532c',
        },
      }),
      new StylelintPlugin({
        configFile: path.resolve(__dirname, '.stylelintrc.json'),
        context: path.resolve(__dirname),
        files: 'src/**/*.(s(c|a)ss|css)',
        fix: true,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'assets/favicon',
            to: 'assets/favicon',
          },
        ],
      }),
      new webpack.HotModuleReplacementPlugin(),
    ];
    if (isProduction) {
      plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].[contenthash].css',
        })
      );
    }
    return plugins;
  };

  return {
    entry: './demo/index.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: '[id].[contenthash].js',
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isDevelopment ? 'source-map' : undefined,
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: true,
              },
            },
          ],
        },

        {
          test: /\.(css)$/,
          use: getStyleLoaders(),
        },

        {
          test: /\.(s[ca]ss)$/,
          use: [
            ...getStyleLoaders(),
            'resolve-url-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['autoprefixer', 'postcss-preset-env'],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment,
                additionalData: '@import "theme/variables.scss";',
                sassOptions: {
                  includePaths: [path.join(__dirname, 'demo')],
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new CssMinimizerPlugin(), new HtmlMinimizerPlugin(), '...'],
    },
    plugins: getPlugins(),
    devServer: {
      hot: true,
      open: true,
      watchContentBase: true,
    },
    resolve: {
      extensions: ['.ts', '.js', '.css', '.scss'],
      modules: ['src', 'node_modules'],
    },
  };
};
