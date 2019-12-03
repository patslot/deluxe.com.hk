var path = require("path");
var webpack = require("webpack");
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  name: "web",
  mode: 'production',
  entry: {
    bundle: ["babel-polyfill", "./web/index.js"]
  },
  resolve: {
    extensions: ["", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "public/bundle"),
    filename: "[name].js",
    publicPath: "/bundle/",
    libraryTarget: "var",
    library: "AddApp"
  },
     watch: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
      },
      {
        test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)(\?.*)?$/,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  },
  plugins: [
    new MinifyPlugin(),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    })
  ]
};
