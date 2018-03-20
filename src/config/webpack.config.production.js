const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.config.base');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('production')
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
};

module.exports = merge(config, {
  //debug: false,
  devtool: 'cheap-module-source-map',
  entry: {
    application: 'production',
    //vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'react-router-redux', 'redux']
  },
  module: {
    noParse: /\.min\.js$/,
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      // Sass
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, '../client/assets/js'),
          path.resolve(__dirname, '../client/assets/styles'),
          path.resolve(__dirname, '../client/scripts')
        ],
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            { loader: 'css-loader', query: { sourceMap: true } },
            //'postcss',
            { loader: 'sass-loader', query: { outputStyle: 'compressed' } }
          ]
        })
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader']
        })
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../client/assets/images'),
        to: 'images'
      },
      {
        from: path.join(__dirname, '../client/assets/nodes'),
        to: 'nodes'
      },
    ]),
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),  
    /*new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        'screw_ie8': true
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),*/

    //new MinifyPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        'screw_ie8': true
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      //debug: false
    }),
    new ExtractTextPlugin({
      filename: 'css/app.css',
      allChunks: true
    }),
    new CompressionPlugin({   
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
   // new BundleAnalyzerPlugin({
     //  analyzerMode: 'static'
    //}),
    
  ]
});
