const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

  module.exports = {
    mode: "production",
    entry: {
      app: {
        import: "./src/index.js",
        dependOn: "vendors",
      },
      vendors: [
        "firebase/app",
        "firebase/database",
        "firebase/firestore",
        "three",
        "immutable",
        "moment",
        '@fortawesome/fontawesome-free/js/fontawesome',
        '@fortawesome/fontawesome-free/js/regular',        
      ],
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    plugins: [
      new CleanWebpackPlugin({ verbose: true }),
      new MomentLocalesPlugin(),
      new HtmlWebpackPlugin({
        title: 'Development',
      }),
      new BundleAnalyzerPlugin(),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: ["babel-loader", "eslint-loader"]
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        { 
          test: /\.jpg$/, 
          loader: "file-loader",
          options: {
            name: '[name].[ext]',
            outputPath: 'img',
          },
        },
        { 
          test: /\.mp3$/, 
          loader: "file-loader",
          options: {
            name: '[name].[ext]',
            outputPath: 'audio'
          }
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
  };