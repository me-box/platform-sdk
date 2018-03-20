var webpack = require('webpack');
var path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('production')
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
};

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

  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin(GLOBALS),  
    new CompressionPlugin({   
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
              //new webpack.optimize.UglifyJsPlugin(),
              //new webpack.DefinePlugin({'process.env': {
              //    'NODE_ENV': JSON.stringify('production')
              //}})
  ],

  
};
