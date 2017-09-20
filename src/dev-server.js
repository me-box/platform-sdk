// Creates a hot reloading development environment

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');
const config = require('./config/webpack.config.development');
const httpProxy = require("http-proxy");

const apiProxy = httpProxy.createProxyServer();

const app = express();
const compiler = webpack(config);

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin());

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8086;


function log() {
  arguments[0] = '\nWebpack: ' + arguments[0];
  console.log.apply(console, arguments);
}

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  historyApiFallback: true
}));

app.use(webpackHotMiddleware(compiler));

app.use(express.static('./client/assets/'))

app.use("/github/*", function(req, res) {
    console.log("proxying github>");
    req.url = `${req.baseUrl}${req.url}`; // Janky hack...
 
    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/nodered/*", function(req, res) {
  console.log("proxying nodered>");
    req.url = `${req.baseUrl}${req.url}`; 
    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/examples/*", function(req, res) {
  
    req.url = `${req.baseUrl}${req.url}`.replace(/\/$/, "");
    console.log("proxying examples: ", req.url);
    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/auth/*", function(req, res) {
  console.log("proxying auth...>");
   req.url = `${req.baseUrl}${req.url}`;
    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/uibuilder/*", function(req, res) {
  console.log("proxying auth...>");
   req.url = `${req.baseUrl}${req.url}`;
    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/lib/*", function(req, res) {
  
   req.url = `${req.baseUrl}${req.url}`.replace(/\/$/, "");
   console.log("proxying LIB!", req.url);

    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/login", function(req, res) {
  console.log("proxying login...>");
   req.url = `${req.baseUrl}${req.url}`;
    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/repo", function(req, res) {
  console.log("proxying repo!...>");
   req.url = `${req.baseUrl}${req.url}`;
    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/settings", function(req, res) {
  console.log("proxying settings...>");
   req.url = `${req.baseUrl}${req.url}`;
    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/images/*", function(req, res) {
  
   req.url = `${req.baseUrl}${req.url}`.replace(/\/$/, "");
   console.log("proxying images", req.url);

    apiProxy.web(req, res, {
      target: {
        port: 9000,
        host: "localhost"
      }
    });
});

app.use("/js/code.js", function(req, res) {
  console.log("proxying code ", req.url);
  res.sendFile(path.join(__dirname, './server/static/js/code.js'));
});


app.get("/nodes/nodes.json", (req,res)=>{
  res.sendFile(path.join(__dirname, './client/assets/nodes/nodes.json'));
});


app.get('*', (req, res) => {
  console.log("serving index.webpackHotMiddleware");
  res.sendFile(path.join(__dirname, './client/assets/index.html'));
});

app.listen(port, host, (err) => {
  if (err) {
    log(err);
    return;
  }

  log('🚧  App is listening at http://%s:%s', host, port);
});
