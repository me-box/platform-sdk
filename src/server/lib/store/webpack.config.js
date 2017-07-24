var webpack = require('webpack');
var path = require('path');

module.exports = {

  entry: path.join(__dirname, '/js/index.js'),
  
  output: {
    path: path.join(__dirname, '../../static/lib'),
    filename: 'store.js',
    libraryTarget: 'var',
    library: 'storelib'
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()],
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
    ]
  },
};
