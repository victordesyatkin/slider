"use strict";
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

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

  return {
    entry: "./src/index.ts",

    mode: "development",
    devtool: "inline-source-map",
    //devtool: isDev && "source-map",

    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /^favicon.png$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
              },
            },
          ],
        },
        // Loading CSS
        {
          test: /\.(css)$/,
          use: getStyleLoaders(),
        },

        // Loading SASS/SCSS
        {
          test: /\.(s[ca]ss)$/,
          use: [...getStyleLoaders(), "resolve-url-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: `./src/index.html`,
      }),
    ],

    output: {
      filename: "main-[fullhash].js",
      path: path.resolve(__dirname, "dist"),
    },

    devServer: {
      open: true,
    },

    resolve: {
      extensions: [".ts", ".js", ".css", ".scss"],
      modules: ["src", "node_modules"],
    },
  };
};
