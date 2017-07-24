var webpack = require('webpack');
var path = require('path');

module.exports = {

  entry: './index.js',

  output: {
    path: path.join(__dirname, '../../../../static/lib'),
    filename: 'testbulb.js',
    libraryTarget: 'var',
    library: 'testbulb'
  },
  externals: {
    "react": "React",
    "configNode":"ConfigNode"
  },
  /*plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'  // fetch API
    }),
  ],*/
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      { 
        test: /\.scss$/, 
        loaders: ['style-loader', 'css-loader', 'sass-loader'] 
      }
    ]
  },
};
