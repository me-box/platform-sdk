//perhaps better to create a couple of files, rather than doing different stuff dependent
//on whether dev or prod!

var path = require("path");

module.exports = {
    entry: {
        editor: [
            './js/app.js',
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server'
        ]
    },
    
    output: {
        publicPath: 'http://localhost:8080/',
        filename: 'static/[name].js'
    },

     "resolve": {
        "alias": {
           "nodeb":"../nodes/b/b",
        }
    },

    //&name=./img/[name].[ext]
    module: {
        loaders:[
                { test: /\.js$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
                { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
                { test: /\.css$/, loaders: ['style', 'css'] },
                { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},
                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff/[name].[ext]" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?limit=8192" }, 
        ],
    },

};
