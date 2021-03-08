"use strict";
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = (env = {}) => {
  const { mode = "development" } = env;

  const isProd = mode === "production";
  const isDev = mode === "development";

  const getStyleLoaders = () => {
    return [
      isProd ? MiniCssExtractPlugin.loader : "style-loader",
      {
        loader: "css-loader",
        options: { sourceMap: isDev },
      },
    ];
  };

  const getPlugins = () => {
    const plugins = [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        getData: () => {
          try {
            return JSON.parse(
              fs.readFileSync(
                `${path.resolve(__dirname, "demo")}/data.json`,
                "utf8"
              )
            );
          } catch (e) {
            console.warn(`data.json was not provided`);
            return {};
          }
        },
        template: "./demo/index.pug",
        filename: "index.html",
        alwaysWriteToDisk: true,
        inject: true,
        hash: true,
        alwaysWriteToDisk: true,
        meta: {
          "msapplication-TileColor": "#da532c",
          "theme-color": "#ffffff",
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/favicon",
            to: "assets/favicon",
          },
        ],
      }),
      new webpack.HotModuleReplacementPlugin(),
    ];
    if (isProd) {
      plugins.push(
        new MiniCssExtractPlugin({
          filename: isDev ? "[name].css" : "[name].[hash].css",
          chunkFilename: isDev ? "[id].css" : "[id].[hash].css",
          insertAt: {
            after: "title",
          },
        })
      );
    }
    return plugins;
  };

  return {
    entry: "./demo/index.ts",
    mode: isProd ? "production" : isDev && "development",
    devtool: isDev && "source-map",

    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "./images/",
                publicPath: "./images",
                name: "[sha1:hash:7]-[sha1:hash:7].[ext]",
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader",
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
          use: [...getStyleLoaders(), "resolve-url-loader", "sass-loader"],
        },
      ],
    },
    plugins: getPlugins(),

    output: {
      filename: "[name].[fullhash:8].js",
      path: path.resolve(__dirname, "dist"),
      chunkFilename: "[id].[chunkhash].js",
    },

    devServer: {
      hot: true,
      open: true,
      watchContentBase: true,
    },

    resolve: {
      extensions: [".ts", ".js", ".css", ".scss"],
      modules: ["src", "node_modules"],
    },
  };
};
