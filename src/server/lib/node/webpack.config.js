var webpack = require('webpack');
var path = require('path');

module.exports = {

  entry: path.join(__dirname, '/js/index.js'),
  
  output: {
    path: path.join(__dirname, '../../static/lib'),
    filename: 'nodelib.js',
    libraryTarget: 'var',
    library: 'ConfigNode'
  },
  externals: {
        "react": "React",
  },

  plugins: [
              //new webpack.optimize.UglifyJsPlugin(),
              //new webpack.DefinePlugin({'process.env': {
              //    'NODE_ENV': JSON.stringify('production')
              //}})
            ],
  
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
