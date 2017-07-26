var path = require("path");
var nodeExternals = require('webpack-node-externals');

module.exports = {
  
  target: 'node',
  
  externals: [nodeExternals()],

  entry: {
    server: ["./server.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      // JavaScript / ES6
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ]
  }
};