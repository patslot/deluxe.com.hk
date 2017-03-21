var path = require("path");
var webpack = require("webpack");

module.exports = {
  name: "web",
  entry: {
    bundle: ["babel-polyfill", "./web/index.js"]
  },
  resolve: {
    extensions: ["", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js",
    libraryTarget: "var",
    library: "AddApp"
  },
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
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    })
  ]
};
