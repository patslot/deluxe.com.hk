var path = require("path");

module.exports = {
  name: "web",
  entry: {
    bundle: ["babel-polyfill", "./controllers/index.js"]
  },
  resolve: {
    extensions: ["", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)(\?.*)?$/,
        loader: "url-loader?limit=100000"
      }
    ]
  }
};
