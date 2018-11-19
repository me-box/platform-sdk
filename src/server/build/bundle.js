/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/extends");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("minimist");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;
exports.sendmessage = sendmessage;

var _socket = __webpack_require__(24);

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ns = void 0;

function init(server, store, secret) {
  console.log("initing socket io");
  var io = _socket2.default.listen(server);

  ns = io.of('/databox');

  ns.on('connection', function (socket) {

    socket.on('join', function (app) {
      console.log("joining client to room ", app);
      socket.join(app);
    });

    socket.on('leave', function (app) {
      console.log("leaving room: " + app);
      socket.leave(app);
    });

    socket.on('disconnect', function () {
      console.log("socket disconnect!");
    });
  });
  console.log("finished initing socket io");
}

function sendmessage(room, event, message) {
  ns.to(room).emit(event, message);
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/toConsumableArray");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dockerode = __webpack_require__(27);

var _dockerode2 = _interopRequireDefault(_dockerode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var docker = new _dockerode2.default({ socketPath: '/var/run/docker.sock' });
exports.default = docker;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("superagent");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = __webpack_require__(5);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.matchLibraries = matchLibraries;
exports.flatten = flatten;
exports.dedup = dedup;
exports.createTarFile = createTarFile;
exports.createDockerImage = createDockerImage;
exports.stopAndRemoveContainer = stopAndRemoveContainer;
exports.createTestContainer = createTestContainer;
exports.writeTempFile = writeTempFile;
exports.removeTempFile = removeTempFile;

var _zlib = __webpack_require__(28);

var _zlib2 = _interopRequireDefault(_zlib);

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

var _tarStream = __webpack_require__(29);

var _tarStream2 = _interopRequireDefault(_tarStream);

var _docker = __webpack_require__(6);

var _docker2 = _interopRequireDefault(_docker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function matchLibraries(code) {

	var REQUIRE_RE = /require\(['"]([^'"]+)['"](?:, ['"]([^'"]+)['"])?\);?/g;
	var IMPORT_RE = /\bimport\s+(?:.+\s+from\s+)?[\'"]([^"\']+)["\']/g;

	var requires = code.match(REQUIRE_RE);
	var imports = code.match(IMPORT_RE);
	var r1 = [],
	    r2 = [];

	if (requires && requires.length > 0) {
		r1 = requires.map(function (pkg) {
			return pkg.replace(/require\w*\(\w*['"]/g, "").replace(/['"]\);*/g, "");
		});
	}

	if (imports && imports.length > 0) {
		r2 = imports.map(function (module) {
			return module.replace(/import\s*/g, "").replace(/\s*(\w|\W|\s)*from\s*/g, "").replace(/['"]/g, "");
		});
	}

	return [].concat((0, _toConsumableArray3.default)(r1), (0, _toConsumableArray3.default)(r2));
}

function flatten(arr) {
	return arr.reduce(function (acc, row) {
		return row.reduce(function (acc, src) {
			acc.push(src);
			return acc;
		}, acc);
	}, []);
}

function dedup(arr) {
	var seen = {};
	return arr.filter(function (item) {
		if (seen[item]) return false;
		seen[item] = true;
		return true;
	});
}

var _addEntry = function _addEntry(pack, name, file) {
	return new Promise(function (resolve, reject) {
		pack.entry({ name: name }, file, function (err) {
			if (err) {
				console.log("error adding entry!", err);
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
};

function createTarFile(dockerfile, flowfile, path) {

	console.log("creating tar file", path);

	var tarball = _fs2.default.createWriteStream(path);
	var gzip = _zlib2.default.createGzip();
	var pack = _tarStream2.default.pack();

	return _addEntry(pack, "Dockerfile", dockerfile).then(function () {
		return _addEntry(pack, "flows.json", flowfile);
	}).then(function () {

		pack.finalize();

		var stream = pack.pipe(gzip).pipe(tarball);

		return new Promise(function (resolve, reject) {

			stream.on('finish', function (err) {
				if (err) {
					console.log("error creating tar file", err);
					reject(err);
				} else {
					console.log("successfully created tar file", path);
					resolve(path);
				}
			});
		});
	});
}
/*return new Promise((resolve, reject)=>{
	var tarball = fs.createWriteStream(path);
	const gzip   = zlib.createGzip();
	const pack   = tar.pack();
	pack.entry({name: 'Dockerfile'}, dockerfile, function(err){
		if (err){
			reject(err);
		}
		
		console.log("am herwe");
		
		pack.entry({name: "flows.json"}, flowfile, function(err){
			if (err){
			
						reject(err);
			}
			console.log("finalising");
			pack.finalize();
		
			const stream = pack.pipe(gzip).pipe(tarball);
	
			stream.on('finish', function (err) {
				resolve(path);
			});	
		});
	});
})
}*/

/*export function createTarFile(dockerfile, path) {

	console.log("OK IN CREATE TAR FILE!!")
	return new Promise((resolve, reject) => {

		var tarball = fs.createWriteStream(path);
		const gzip = zlib.createGzip();
		const pack = tar.pack();

		pack.entry({ name: 'Dockerfile' }, dockerfile, function (err) {
			if (err) {
				reject(err);
			}
			pack.finalize();

			const stream = pack.pipe(gzip).pipe(tarball);

			stream.on('finish', function (err) {
				resolve(path);
			});
		});
	});
}*/

function createDockerImage(tarfile, tag) {

	console.log('creating image for tarfile ' + tarfile + ' with docker tag ' + tag);

	return new Promise(function (resolve, reject) {
		_docker2.default.buildImage(tarfile, { t: tag, nocache: true }, function (err, output) {
			if (err) {
				console.log("error building image", err);
				console.warn(err);
				reject(err);
				return;
			}
			output.pipe(process.stdout);

			output.on('error', function (err) {
				console.log("ERROR!!!", err);
				reject(err);
				return;
			});

			output.on('end', function () {
				console.log("FINISHED!!!");
				resolve(tag);
			});
		});
	});
}

function stopAndRemoveContainer(name) {

	return new Promise(function (resolve, reject) {

		var container = _docker2.default.listContainers({ all: true }, function (err, containers) {

			if (err) {
				reject(err);
			}

			var container = containers.reduce(function (acc, container) {
				console.log("checking", '/' + name, " in ", container.Names);

				if (container.Names.indexOf('/' + name) != -1) {
					return container;
				}
				return acc;
			}, null);

			if (!container) {
				console.log("did not find container");
				reject();
				return;
			}

			var containerToStop = _docker2.default.getContainer(container.Id);

			containerToStop.stop(function (err, data) {
				console.log("container stopped!");
				//if (err){
				//	reject(err);
				//	return;
				//}
				containerToStop.remove(function (err, data) {
					if (err) {
						reject(err);
					} else {
						resolve(true);
					}
				});
			});
		});
	});
}

/*
 note we open port 9123  to open a websocket to receive video from the client when 
 a webcam is used and 8096 is the (docker mapped) port that serves up the webcam page
*/
function createTestContainer(image, name, network) {
	var self = this;
	console.log('creating test container ' + image + ', name: ' + name);
	//#PortBindings: { "9123/tcp": [{ "HostPort": "9123" }] }, 
	//"9123/tcp":{},
	return new Promise(function (resolve, reject) {
		_docker2.default.createContainer({
			Image: image,
			PublishAllPorts: true,
			Links: ["mock-datasource:mock-datasource", "databox-test-server:databox-test-server" /*, "openface:openface"*/],
			Env: ["TESTING=true", "MOCK_DATA_SOURCE=http://mock-datasource:8080"],
			//HostConfig: {NetworkMode: network},
			Labels: { 'user': '' + name },
			ExposedPorts: { "1880/tcp": {}, "8096/tcp": {} },
			Cmd: ["npm", "start", "--", "--userDir", "/data"],
			name: name + '-red'
		}, function (err, container) {
			if (err) {
				console.log("error:", err);
				return stopAndRemoveContainer(name + '-red').then(function () {
					return createTestContainer(image, name, network);
				}, function (err) {
					reject(err);
					return;
				});
			} else {
				console.log("ok am here");
				container.start({}, function (err, data) {
					if (err) {
						console.log("error starting container", err);
						reject(err);
					} else {
						console.log("started container");
						resolve(container);
					}
				});
			}
		});
	});
}

function writeTempFile(filestr, fileName) {

	return new Promise(function (resolve, reject) {
		_fs2.default.writeFile(fileName, filestr, function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(true);
		});
	});
}

function removeTempFile(fileName) {
	return new Promise(function (resolve, reject) {
		_fs2.default.unlink(fileName, function (err) {
			if (err) {
				console.log(err);
				reject(err);
				return;
			}
			resolve(true);
		});
	});
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(7);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = __webpack_require__(8);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _http = __webpack_require__(15);

var _http2 = _interopRequireDefault(_http);

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _expressSession = __webpack_require__(16);

var _expressSession2 = _interopRequireDefault(_expressSession);

var _connectRedis = __webpack_require__(17);

var _connectRedis2 = _interopRequireDefault(_connectRedis);

var _bodyParser = __webpack_require__(18);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = __webpack_require__(19);

var _strategies = __webpack_require__(20);

var _strategies2 = _interopRequireDefault(_strategies);

var _minimist = __webpack_require__(3);

var _minimist2 = _interopRequireDefault(_minimist);

var _websocket = __webpack_require__(4);

var _websocket2 = _interopRequireDefault(_websocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RedisStore = (0, _connectRedis2.default)(_expressSession2.default);
var argv = (0, _minimist2.default)(process.argv.slice(2));

var PORT = argv.port || 8086;
var dev = argv.dev || false;
console.log("set port to", PORT);
console.log("dev mode ", dev);

(0, _config.fetch)({ dev: dev }).then(function (config) {
  start(config);
}, function (err) {
  console.log("error reading config!", err);
});

function checkcredentials(config) {
  var _config$github = config.github,
      CLIENT_ID = _config$github.CLIENT_ID,
      CLIENT_SECRET = _config$github.CLIENT_SECRET,
      CALLBACK = _config$github.CALLBACK;

  return CLIENT_ID.trim() != "" && CLIENT_SECRET.trim() != "" && CALLBACK.trim() != "";
}

function addroutes(app, auth) {
  console.log("adding routes");
  app.use('/auth', __webpack_require__(25));
  app.use('/github', auth, __webpack_require__(26));
  app.use('/nodered', auth, __webpack_require__(30));
  app.use('/samples', auth, __webpack_require__(32));
  app.use('/uibuilder', auth, __webpack_require__(33));
  console.log("successfully added routes");
}

function start(config) {
  var _this = this;

  var app = (0, _express2.default)();

  //to support posts!
  app.use(_bodyParser2.default.urlencoded({ extended: false, limit: '5mb' }));
  app.use(_bodyParser2.default.json({ limit: '5mb' }));

  app.use((0, _expressSession2.default)({
    store: new RedisStore({
      host: config.redis.host,
      port: config.redis.port
    }),
    key: 'express.sid',
    resave: false,
    rolling: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000 //2 days
    },
    secret: config.secret
  }));

  app.set('view engine', 'html');
  app.engine('html', __webpack_require__(35).renderFile);

  var server = _http2.default.createServer(app);
  console.log("created server!");

  var auth = function auth(req, res, next) {

    if (req.isAuthenticated()) {
      req.config = config;
      return next(null);
    }

    res.redirect("/login");
  };

  if (checkcredentials(config)) {
    (0, _strategies2.default)(app, config);
    addroutes(app, auth);
  }

  console.log("calling init");
  (0, _websocket2.default)(server, RedisStore, config.secret);
  console.log("done!");

  app.get('/login', function (req, res) {
    res.render('login');
  });

  app.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
  });

  app.use('/', _express2.default.static("static"));

  app.get('/', function (req, res) {

    if (!checkcredentials(config)) {
      console.log("credentials are empty, so redirecting to settings");
      res.redirect('/settings');
      return;
    }

    if (!req.isAuthenticated()) {
      res.redirect("/login");
      return;
    }

    res.render('index');
  });

  app.get('/settings', function (req, res) {
    if (checkcredentials(config)) {
      res.redirect("/login");
    } else {
      res.render('settings', { title: "Nearly there - you just need set your github settings", config: config.github });
    }
  });

  app.get('/settings/testurl', function (req, res) {
    res.send({ testurl: config.testserver.URL });
  });

  app.post('/config/update', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
      var settings;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("seen an upatde!!", req.body);
              _context.next = 3;
              return (0, _config.fetch)({ dev: dev });

            case 3:
              settings = _context.sent;
              _context.next = 6;
              return (0, _config.write)(JSON.stringify((0, _extends3.default)({}, settings, { github: (0, _extends3.default)({}, settings.github, req.body) }), null, 4));

            case 6:
              res.send({ testurl: config.testserver.URL });

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  console.log('listening on port ' + PORT);
  server.listen(PORT);
}

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("connect-redis");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.fetch = fetch;
exports.write = write;
exports.defaultdevsettings = defaultdevsettings;
exports.defaultsettings = defaultsettings;

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetch() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        console.log("fecthing confoig settings!");
        return new Promise(function (resolve, reject) {

                _fs2.default.readFile("./conf/settings.json", 'utf8', function (err, data) {
                        console.log("read in config!");
                        if (err) {
                                return write(JSON.stringify(options.dev ? defaultdevsettings() : defaultsettings(), null, 4)).then(function (settings) {

                                        resolve(settings);
                                        return;
                                });
                        }
                        try {
                                var settings = JSON.parse(data);

                                resolve(settings);
                                return;
                        } catch (err) {
                                console.log("error reading settings file!", err);
                                reject(defaultsettings());
                        };
                });
        });
}

function write(file) {
        return new Promise(function (resolve, reject) {
                try {
                        _fs2.default.mkdir("./conf", function () {

                                _fs2.default.writeFile("./conf/settings.json", file, function (err) {
                                        if (err) {
                                                console.log("hmmm error writing conf/settings.json");
                                                reject(JSON.parse(file));
                                                return;
                                        }
                                        console.log("successfully created directory");
                                        resolve(JSON.parse(file));
                                });
                        });
                } catch (err) {
                        console.log("error writing conf file", err);
                        reject(JSON.parse(file));
                        return;
                }
        });
}

function defaultdevsettings() {
        return {

                "secret": "asdaksgdsahgdhsagd ahjsgdjhsg",

                "github": {
                        "CLIENT_ID": "",
                        "CLIENT_SECRET": "",
                        "CALLBACK": "http://localhost:8086/auth/github/callback",
                        "API": "https://api.github.com",
                        "RAW_URL": "https://raw.githubusercontent.com",
                        "URL": "https://github.com"
                },

                "appstore": {
                        "URL": "http://localhost:8091"
                },

                "registry": {
                        "URL": ""
                },

                "mongo": {
                        "URL": "mongodb://localhost:27017"
                },

                "redis": {
                        "host": "localhost",
                        "port": 6379
                },

                "testserver": {
                        "URL": "http://localhost:9090"
                }

        };
}

function defaultsettings() {
        return {

                "secret": "asjhgdsajhd6sa7d78as6s87adsakgdsadgaskdgsagdk",

                "github": {
                        "CLIENT_ID": "",
                        "CLIENT_SECRET": "",
                        "CALLBACK": "http://localhost:8086/auth/github/callback",
                        "API": "https://api.github.com",
                        "RAW_URL": "https://raw.githubusercontent.com",
                        "URL": "https://github.com"
                },

                "appstore": {
                        "URL": ""
                },

                "registry": {
                        "URL": ""
                },

                "mongo": {
                        "URL": "mongodb://mongo:27017"
                },

                "redis": {
                        "host": "redis",
                        "port": 6379
                },

                "testserver": {
                        "URL": "http://localhost:9090"
                }

        };
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = initPassport;

var _passport = __webpack_require__(9);

var _passport2 = _interopRequireDefault(_passport);

var _passportGithub = __webpack_require__(21);

var _passportGithub2 = _interopRequireDefault(_passportGithub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GitHubStrategy = _passportGithub2.default.Strategy;

function initPassport(app, config) {
	var _config$github = config.github,
	    _config$github$CLIENT = _config$github.CLIENT_ID,
	    CLIENT_ID = _config$github$CLIENT === undefined ? "" : _config$github$CLIENT,
	    _config$github$CLIENT2 = _config$github.CLIENT_SECRET,
	    CLIENT_SECRET = _config$github$CLIENT2 === undefined ? "" : _config$github$CLIENT2,
	    _config$github$CALLBA = _config$github.CALLBACK,
	    CALLBACK = _config$github$CALLBA === undefined ? "" : _config$github$CALLBA;


	if (CLIENT_ID.trim() == "" || CLIENT_SECRET.trim() == "" || CALLBACK.trim() == "") {
		return;
	}

	var User = __webpack_require__(22)(config.mongo.URL);

	app.use(_passport2.default.initialize());
	app.use(_passport2.default.session());

	_passport2.default.use(new GitHubStrategy({
		clientID: config.github.CLIENT_ID,
		clientSecret: config.github.CLIENT_SECRET,
		callbackURL: config.github.CALLBACK
	}, function (accessToken, refreshToken, profile, cb) {

		User.findOne({ githubId: profile.id }, function (err, user) {

			if (user == null) {
				console.log("creating new user");
				var newuser = new User({ githubId: profile.id,
					username: profile.username,
					accessToken: accessToken,
					email: profile.email
				});
				newuser.save(function (err) {
					return cb(err, user);
				});
			} else {
				//MUST update here - incase the token has changed

				User.update({ githubId: profile.id }, { $set: { accessToken: accessToken } }, function (err, u) {
					return cb(null, user);
				});
			}
		});
	}));

	_passport2.default.serializeUser(function (user, done) {
		done(null, user._id);
	});

	_passport2.default.deserializeUser(function (id, done) {

		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
}

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("passport-github");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(23);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (url) {

	_mongoose2.default.connect(url + '/passport');

	return _mongoose2.default.model('User', {
		username: String,
		githubId: String,
		email: String,
		accessToken: String
	});
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _passport = __webpack_require__(9);

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

//need to explicity log this user out 
router.get('/logout', function (req, res) {

	//var User = require('../models/user')(req.config.mongo.URL);

	//if (req.user){
	//	User.findOne({ username: req.user.username}).remove().exec();
	//}
	console.log("logging out!");
	req.logout();
	res.redirect('/');
});

router.get('/loggedin', function (req, res) {
	res.send({ status: req.isAuthenticated() ? "ok" : "fail" });
});

router.get('/github', _passport2.default.authenticate('github', { scope: 'public_repo' }));

router.get('/github/callback', _passport2.default.authenticate('github', { failureRedirect: '/auth/github' }), function (req, res) {
	console.log("callback success");
	res.redirect('/');
});

module.exports = router;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(7);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(8);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = __webpack_require__(5);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _superagent = __webpack_require__(10);

var _superagent2 = _interopRequireDefault(_superagent);

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(11);

var _path2 = _interopRequireDefault(_path);

var _docker = __webpack_require__(6);

var _docker2 = _interopRequireDefault(_docker);

var _utils = __webpack_require__(12);

var _websocket = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var agent = _superagent2.default.agent();
var networks = ["databox_default", "bridge"];


//TODO: check if container is tagged instead, as this is a less ambiguous way of retrieving the required container
var _fetchDockerIP = function _fetchDockerIP(containerName) {

	console.log('retrieving docker ip for container ' + containerName);

	return new Promise(function (resolve, reject) {
		_docker2.default.listContainers({}, function (err, containers) {
			if (err) {
				console.log("error listing containers!!");
				reject(containers);
			} else {
				var ip = containers.reduce(function (acc, c) {
					if (_name(c).indexOf(containerName) !== -1) {
						//console.log("found container!!!");
						return _addr(c);
					}
					return acc;
				}, "127.0.0.1");
				console.log("RETURNING IP", ip);
				resolve(ip);
			}
		});
	});
};

var _name = function _name(container) {
	try {
		if (container["Names"]) {
			return container["Names"][0].split("\/").slice(-1)[0];
		} else {
			return "";
		}
	} catch (err) {
		console.log("error getting name for container", container);
		return "";
	}
};

var _addr = function _addr(container) {
	//console.log("GETTING THE ADDRESS OF THE CONTAINER", JSON.stringify(container,null,4));
	//databox_databox-cm-app-server-net
	//ingress
	console.log("retrieving addr for", container);

	if (container.NetworkSettings && container.NetworkSettings.Networks) {
		var net = networks.find(function (network) {
			return container.NetworkSettings.Networks[network];
		});

		console.log("found ip addr for network", net);

		if (net) {
			return container.NetworkSettings.Networks[net].IPAddress || "127.0.0.1";
		}
	}

	return "127.0.0.1";
};

var _createCommit = function _createCommit(config, user, repo, sha, filename, content, message, accessToken) {

	return new Promise(function (resolve, reject) {
		_superagent2.default.put(config.github.API + '/repos/' + user.username + '/' + repo + '/contents/' + filename).send({
			"message": message,
			"committer": {
				"name": user.username,
				"email": user.email || user.username + '@me-box.com'
			},
			"content": content,
			"sha": sha
		}).set('Authorization', 'token ' + accessToken).set('Accept', 'application/json').end(function (err, data) {
			if (err) {
				console.log("******** ERROR ********", err);
				reject(err);
			} else {
				//have found that it can still take time before this registers as the latest commit.
				resolve(data);
			}
		});
	});
};

var _createRepo = function _createRepo(config, user, name, description, flows, dockerfile, commitmessage, accessToken) {

	return new Promise(function (resolve, reject) {

		_superagent2.default.post(config.github.API + '/user/repos').send({
			"name": name,
			"description": description,
			"private": false,
			"has_issues": false,
			"has_wiki": false,
			"has_downloads": false,
			"topic": "databox"
		}).set('Authorization', 'token ' + accessToken).set('Accept', 'application/json').end(function (err, data) {
			if (err) {
				console.log("--> failed to create repo!");
				reject(err);
			} else {

				var result = data.body;

				//give github time it needs to set up repo

				setTimeout(function () {
					resolve({
						name: result.name,
						updated: result.updated_at,
						icon: result.owner.avatar_url,
						url: result.url
					});
				}, 2000);
			}
		});
	}).then(function (repo) {

		return new Promise(function (resolve, reject) {
			_superagent2.default.put(config.github.API + '/repos/' + user.username + '/' + repo.name + '/topics').send({ names: ["databox"] }).set('Authorization', 'token ' + accessToken).set('Accept', 'application/vnd.github.mercy-preview+json').end(function (err, data) {
				if (err) {
					console.log("failed to create repo", err);
					reject(err);
				} else {
					resolve(repo);
				}
			});
		});
	}).then(function (repo) {

		return Promise.all([Promise.resolve(repo), _addFile({
			config: config,
			username: user.username,
			repo: repo.name,
			filename: 'flows.json',
			email: user.email || user.username + '@me-box.com',
			message: commitmessage,
			content: new Buffer(JSON.stringify(flows, null, 4)).toString('base64'),
			accessToken: accessToken
		})]);
	}).then(function (values) {
		console.log("ok, created flows, now creating dockerfile!", dockerfile);

		var reponame = values[0];
		console.log("reponame is", reponame);

		return Promise.all([Promise.resolve(reponame), Promise.resolve(values[1]), _addFile({
			config: config,
			username: user.username,
			repo: reponame.name,
			filename: 'Dockerfile',
			email: user.email || user.username + '@me-box.com',
			message: commitmessage,
			content: new Buffer(dockerfile).toString('base64'),
			accessToken: accessToken
		})]);
	});
};

var _addFile = function _addFile(options) {
	var config = options.config,
	    username = options.username,
	    repo = options.repo,
	    filename = options.filename,
	    message = options.message,
	    email = options.email,
	    content = options.content,
	    accessToken = options.accessToken;


	return new Promise(function (resolve, reject) {
		_superagent2.default.put(config.github.API + '/repos/' + username + '/' + repo + '/contents/' + filename).send({
			"message": message,
			"committer": {
				"name": username,
				"email": email
			},
			"content": content
		}).set('Authorization', 'token ' + accessToken).set('Accept', 'application/json').end(function (err, res) {
			if (err) {
				console.log("error adding file", err);
				reject(err);
			} else {
				resolve(Object.assign({}, res.body, { repo: repo }));
			}
		});
	});
};

var _fetchFile = function _fetchFile(config, username, repoowner, accessToken, repo, filename) {

	console.log('{fetching file: ' + filename);

	return new Promise(function (resolve, reject) {
		_superagent2.default.get(config.github.API + '/repos/' + repoowner + '/' + repo + '/contents/' + filename).set('Accept', 'application/json').set('Authorization', 'token ' + accessToken).end(function (err, data) {
			if (err || !data.ok) {
				console.log("rejecting!");
				reject(err);
			} else {

				//only send back sha (used for future updates) if user that requested this repo is the owner
				var str = new Buffer(data.body.content, 'base64').toString('ascii');
				try {
					if (username === repoowner) {
						resolve({ content: str, sha: data.body.sha });
					} else {
						resolve({ content: str });
					}
				} catch (error) {
					resolve({ content: {} });
				}
			}
		});
	});
};

var _wait = function _wait(storeurl) {

	return new Promise(function (resolve, reject) {
		function get() {
			console.log('calling ' + storeurl);
			agent.get('' + storeurl, function (error, response, body) {
				if (error) {
					console.log("[seeding manifest] waiting for appstore", error);
					setTimeout(get, 4000);
				} else {
					resolve();
					return;
				}
			});
		}
		setTimeout(get, 2000);
	});
};

var _saveToAppStore = function _saveToAppStore(config, manifest, username) {
	console.log("in save to app store with manifest", manifest);

	//if no appstore url specified, assume a dockerised one running and retrieve docker ip
	if (!config.appstore || (config.appstore.URL || "").trim() === "") {
		console.log("fetching docker ip for databox_app-server");
		return _fetchDockerIP("databox_app-server").then(function (ip) {
			console.log("url to post to:", ip);
			return _postToAppStore(ip + ':8181', manifest, username);
		});
	} else {

		return _postToAppStore(config.appstore.URL, manifest, username);
	}
};

//this should now post to github manifest repo!
var _postToAppStore = function _postToAppStore(storeurl, manifest, username) {
	return new Promise(function (resolve, reject) {
		resolve();
	});
};
/*const _postToAppStore = function (storeurl, manifest, username) {

	if (storeurl.trim() === "none") {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	const addscheme = storeurl.indexOf("http://") == -1 && storeurl.indexOf("https://") == -1;
	const _url = addscheme ? `https://${storeurl}` : storeurl;

	console.log("posting to app store", `${_url}/app/post`);
	sendmessage(username, "debug", { msg: `posting to app store ${_url}/app/post` });

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	return _wait(_url).then(() => {
		return new Promise((resolve, reject) => {
			agent
				.post(`${_url}/app/post`)
				.send(manifest)
				.set('Accept', 'application/json')
				.type('form')
				.end(function (err, res) {
					if (err) {
						console.log("error posting to app store", err);
						reject(err);
					} else {
						console.log("successfully posted to app store", res.body);
						resolve(res.body);
					}
					console.log("unset reject auth");
					process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
				})
		});
	});
}*/

var _generateDockerfile = function _generateDockerfile(libraries, config, name) {

	var libcommands = libraries.map(function (library) {
		return 'RUN cd /data/nodes/databox && npm install --save ' + library;
	});

	//add a echo statement to force it not to cache (nocache option in build doesn't seem to work
	var dcommands = ['FROM tlodge/databox-red:latest', 'ADD flows.json /data/flows.json', 'LABEL databox.type="app"', 'LABEL databox.manifestURL="' + config.appstore.URL + '/' + name.toLowerCase() + '/databox-manifest.json"'];

	var startcommands = ["EXPOSE 8080", "CMD /root/start.sh"];

	return [].concat(dcommands, (0, _toConsumableArray3.default)(libcommands), startcommands).join("\n");
};

var _generateManifest = function _generateManifest(config, user, reponame, app, packages, allowed) {

	console.log("generating manifest!");

	var appname = app.name.startsWith(user.username) ? app.name : user.username + '-' + app.name;

	return {
		'manifest-version': 1,
		name: appname.toLowerCase(),
		version: "0.1.0",
		description: app.description,
		author: user.username,
		licence: "MIT",
		"databox-type": "app",
		tags: app.tags ? app.tags.split(",") : "",
		homepage: config.github.URL + '/' + user.username + '/' + reponame,
		repository: {
			type: 'git',
			url: 'git+' + config.github.URL + '/' + user.username + '/' + reponame + '.git'
		},
		packages: packages.map(function (pkg) {
			return {
				id: pkg.id,
				name: pkg.name,
				purpose: pkg.purpose,
				required: pkg.install === "compulsory",
				datastores: Array.from(new Set([].concat((0, _toConsumableArray3.default)(pkg.datastores.map(function (d) {
					return d.id;
				}))))),
				risk: pkg.risk,
				benefits: pkg.benefits
			};
		}),

		'allowed-combinations': allowed,

		datasources: (0, _utils.flatten)(packages.map(function (pkg) {
			return pkg.datastores.map(function (d) {
				return {
					type: d.type,
					required: true,
					name: d.name || d.type,
					clientid: d.id,
					granularities: []
				};
			});
		})),

		"network-permissions": [],

		"resource-requirements": {},

		volumes: []
	};
};

var _pull = function _pull(repo) {
	return new Promise(function (resolve, reject) {
		_docker2.default.pull(repo, function (err, stream) {
			_docker2.default.modem.followProgress(stream, onFinished, onProgress);

			function onFinished(err, output) {
				if (err) {
					reject(err);
				} else {
					resolve(output);
				}
			}
			function onProgress(event) {
				console.log(event);
			}
		});
	});
};

var _stripscheme = function _stripscheme(url) {
	return url.replace("http://", "").replace("https://", "");
};

var _uploadImageToRegistry = function _uploadImageToRegistry(tag, registry, username) {

	console.log("uploading image to registry", tag, registry, username);
	return new Promise(function (resolve, reject) {
		if (registry && registry.trim() !== "") {

			var image = _docker2.default.getImage(tag);
			console.log("ok have image to upload", tag);
			console.log(image);
			image.push({ registry: registry }, function (err, stream) {

				_docker2.default.modem.followProgress(stream, onFinished, onProgress);

				function onFinished(err, output) {
					console.log("FINISHED PUSHING IMAGE!");
					if (err) {
						(0, _websocket.sendmessage)(username, "debug", { msg: err.json.message });
						reject(err);
					} else {
						(0, _websocket.sendmessage)(username, "debug", { msg: "successfully pushed image!" });
						resolve(output);
					}
				}

				function onProgress(event) {
					(0, _websocket.sendmessage)(username, "debug", { msg: '[pushing]: ' + JSON.stringify(event) });
				}
			});
		} else {
			resolve();
		}
	});
};

var _formatmanifest = function _formatmanifest(manifest, config, user) {

	console.log("formatting manifest", JSON.stringify(manifest, null, 4));
	//if empty object return
	if (Object.keys(manifest).length === 0 && manifest.constructor === Object) {
		return manifest;
	}

	return (0, _extends3.default)({}, manifest, {
		name: manifest.name.toLowerCase(),
		homepage: manifest.homepage.toLowerCase(),
		"docker-image": manifest.name.toLowerCase(),
		"docker-registry": _stripscheme(config.registry.URL) || user.username,
		"docker-image-tag": "latest",
		repository: (0, _extends3.default)({}, manifest.repository, {
			url: manifest.repository.url.toLowerCase()
		})
	});
};

var _buildImage = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(config, user, manifest, flows, dockerfile) {
		var path, tarfile, _appname, _tag, tag;

		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:

						(0, _websocket.sendmessage)(user.username, "debug", { msg: "pulling latest base container" });

						_context.next = 3;
						return _pull("tlodge/databox-red:latest").catch(function (err) {
							console.log("failed to pull latest base image!");
							(0, _websocket.sendmessage)(user.username, "debug", { msg: "could not pull latest image", err: err });
							throw err;
						});

					case 3:

						(0, _websocket.sendmessage)(user.username, "debug", { msg: "finshed pulling latest base container" });

						path = user.username + '-tmp.tar.gz';
						_context.next = 7;
						return (0, _utils.createTarFile)(dockerfile, flows, path).catch(function (err) {
							console.log("failed to create tar file for building docker image!", err);
							(0, _websocket.sendmessage)(user.username, "debug", { msg: "could not create tar file!" });
							throw err;
						});

					case 7:
						tarfile = _context.sent;


						(0, _websocket.sendmessage)(user.username, "debug", { msg: "successfully created tar file, creating docker image" });

						_appname = manifest.name.toLowerCase(); //.replace(`${user.username}-`, "");

						_tag = config.registry.URL && config.registry.URL.trim() != "" ? '' + _stripscheme(config.registry.URL) : '' + user.username.toLowerCase();
						_context.next = 13;
						return (0, _utils.createDockerImage)(tarfile, _tag + '/' + _appname + '-amd64:' + (config.version || "latest")).catch(function (err) {
							console.log("failed to create docker image", err);
							(0, _websocket.sendmessage)(user.username, "debug", { msg: err });
							throw err;
						});

					case 13:
						tag = _context.sent;


						(0, _websocket.sendmessage)(user.username, "debug", { msg: 'uploading to registry with tag ' + tag });

						_context.next = 17;
						return _uploadImageToRegistry(tag, '' + config.registry.URL, user.username.toLowerCase()).catch(function (err) {
							(0, _websocket.sendmessage)(user.username, "debug", { msg: err });
							console.log("failed to upload image to registry!", err);
							throw err;
						});

					case 17:

						(0, _websocket.sendmessage)(user.username, "debug", { msg: "successfully published" });

					case 18:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function _buildImage(_x, _x2, _x3, _x4, _x5) {
		return _ref.apply(this, arguments);
	};
}();

//TODO: remove this - no longer needed
var _publish = function _publish(config, user, manifest, flows, dockerfile) {

	return new Promise(function (resolve, reject) {
		//create a new docker file
		(0, _websocket.sendmessage)(user.username, "debug", { msg: "pulling latest base container" });
		return _pull("tlodge/databox-red:latest").then(function () {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: "finshed pulling latest base container" });
			//const manifest = _generateManifest(config, user, app.name, app, packages, allowed);


			var data = {
				manifest: JSON.stringify(_formatmanifest(manifest, config, user)),

				poster: JSON.stringify({
					username: user.username
				}),

				postDate: JSON.stringify(new Date().toISOString()),

				queries: JSON.stringify(0)
			};
			return _saveToAppStore(config, data, user.username);
		}, function (err) {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: "could not save to app store" });
			reject("could not save to app store!");
			return;
		}).then(function (result) {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: "successfully saved to app store" });
			var path = user.username + '-tmp.tar.gz';
			return (0, _utils.createTarFile)(dockerfile, flows, path);
		}, function (err) {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: "could not create tar file!" });
			reject("could not create tar file");
			return;
		}).then(function (tarfile) {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: "successfully created tar file, creating docker image" });
			console.log("config file", JSON.stringify(config, null, 4));
			console.log("version ", config.version);
			var _appname = manifest.name.startsWith(user.username) ? manifest.name.toLowerCase() : user.username.toLowerCase() + '-' + manifest.name.toLowerCase();
			var _tag = config.registry.URL && config.registry.URL.trim() != "" ? _stripscheme(config.registry.URL) + '/' : "";
			return (0, _utils.createDockerImage)(tarfile, '' + _tag + _appname + '-amd64:' + (config.version || "latest"));
		}, function (err) {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: err.json.message });
			reject("could not create docker image", err);
			return;
		}).then(function (tag) {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: 'uploading to registry with tag ' + tag });
			return _uploadImageToRegistry(tag, '' + config.registry.URL, user.username.toLowerCase());
		}, function (err) {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: err.json.message });
			reject('could not upload to registry');
			return;
		}).then(function () {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: "successfully published" });
			resolve();
		});
	});
};

//list all apps owned by this user
router.get('/repos/:user', function (req, res) {
	var user = req.user;
	var username = req.params.user;

	//set to this user if passed in empty string or no user
	if (!username || username.trim() === "") {
		username = req.user.username;
	}

	var query = {
		user: username,
		topic: "databox"
	};
	_superagent2.default
	//.get(`${req.config.github.API}/users/${username}/repos`)
	.get(req.config.github.API + '/search/repositories').query({ q: 'user:' + user.username + ' topic:databox' }).set('Accept', 'application/json').set('Authorization', 'token ' + req.user.accessToken).query(query).end(function (err, data) {
		if (err) {
			console.log(err);
			res.status(500).send({ error: 'could not retrieve repos' });
			//res.send({username,repos:[]})
		} else {

			var repos = data.body.items.map(function (repo) {

				return {
					name: repo.name,
					description: repo.description,
					updated: repo.updated_at,
					icon: repo.owner.avatar_url,
					url: repo.url
				};
			});

			res.send({ username: username, repos: repos });
		}
	});
});

//list all apps owned by this user
router.get('/repos', function (req, res) {
	console.log("getting repos with accessToken", req.user.accessToken);
	var user = req.user;

	_superagent2.default
	//.get(`${req.config.github.API}/users/${user.username}/repos`)
	.get(req.config.github.API + '/search/repositories').query({ q: 'user:' + user.username + ' topic:databox' }).set('Accept', 'application/json').set('Authorization', 'token ' + req.user.accessToken).end(function (err, data) {
		if (err) {
			console.log(err);
			//req.logout();
			res.status(500).send({ error: 'could not retrieve repos' });
		} else {

			var repos = data.body.items.map(function (repo) {

				return {
					name: repo.name,
					description: repo.description,
					updated: repo.updated_at,
					icon: repo.owner.avatar_url,
					url: repo.url
				};
			});

			res.send({ username: req.user.username, repos: repos });
		}
	});
});

//load up an app from a repo
router.get('/flow', function (req, res) {

	var user = req.user;
	var repo = req.query.repo;
	var owner = req.query.username || user.username;

	console.log("would fetch", repo + '-manifest.json');

	return Promise.all([_fetchFile(req.config, user.username, owner, user.accessToken, repo, 'flows.json'), _fetchFile(req.config, user.username, owner, user.accessToken, "databox-manifest-store", repo + '-manifest.json'), _fetchFile(req.config, user.username, owner, user.accessToken, repo, 'Dockerfile')]).then(function (values) {

		var flows = (0, _extends3.default)({}, values[0], { content: JSON.parse(values[0].content) });
		var manifest = (0, _extends3.default)({}, values[1], { content: JSON.parse(values[1].content) });

		res.send({
			result: 'success',
			flows: flows,
			manifest: manifest,
			Dockerfile: values[2]
		});
	}, function (err) {
		console.log(err);
		res.status(500).send({ error: 'could not retrieve flows, manifest and Dockerfile' });
	});
});

//create a new 'app' (i.e a github repo prefixed with 'databox.').  Will also create a new  flows.json / manifest.json file.

router.post('/repo/new', function (req, res) {

	var user = req.user;
	var name = req.body.name.toLowerCase();
	var description = req.body.description || "";
	var flows = req.body.flows || [];
	var manifest = req.body.manifest || {};
	var dockerfile = '# ' + name + ' Dockerfile';
	var commitmessage = req.body.message || "first commit";

	console.log("manifest", JSON.stringify(_formatmanifest(manifest, req.config, user), null, 4));

	return _createRepo(req.config, user, name, description, flows, dockerfile, commitmessage, req.user.accessToken).then(function (repo) {
		console.log("successfully created repo", repo);
		return repo;
	}).then(function (values) {
		res.send({
			result: 'success',
			repo: values[0],
			sha: {
				flows: values[1].content.sha,
				manifest: values[2].content.sha,
				Dockerfile: values[3].content.sha
			}
		});
	}, function (err) {
		console.log(err);
		res.status(500).send({ error: 'could not create files' });
	});
});

router.post('/repo/update', function (req, res) {

	console.log("updating manifest", JSON.stringify(req.body.manifest, null, 4));
	var user = req.user;
	var repo = req.body.repo;
	var sha = req.body.sha;

	var message = req.body.message || "checkpoint commit";

	var libraries = (0, _utils.dedup)((0, _utils.flatten)(req.body.flows.reduce(function (acc, node) {
		if (node.type === "dbfunction") {
			acc = [].concat((0, _toConsumableArray3.default)(acc), [(0, _utils.matchLibraries)(node.func)]);
		}
		return acc;
	}, [])));

	var dockerfile = _generateDockerfile(libraries, req.config, req.body.manifest.name);
	var flowscontent = new Buffer(JSON.stringify(req.body.flows, null, 4)).toString('base64');
	var manifestcontent = new Buffer(JSON.stringify(_formatmanifest(req.body.manifest, req.config, user), null, 4)).toString('base64');
	var dockerfilecontent = new Buffer(dockerfile).toString('base64');

	return _createCommit(req.config, user, repo, sha.flows, 'flows.json', flowscontent, message, user.accessToken).then(function (data) {
		return Promise.all([Promise.resolve(data.body.content.sha), _createCommit(req.config, user, repo, sha.manifest, 'databox-manifest.json', manifestcontent, message, user.accessToken)]);
	}, function (err) {
		res.status(500).send({ error: err });
	}).then(function (values) {
		return Promise.all([Promise.resolve(values[0]), Promise.resolve(values[1].body.content.sha), _createCommit(req.config, user, repo, sha.Dockerfile, 'Dockerfile', dockerfilecontent, message, user.accessToken)]);
	}).then(function (values) {

		res.send({
			result: 'success',
			repo: repo,
			sha: {
				flows: values[0],
				manifest: values[1],
				Dockerfile: values[2].body.content.sha
			}
		});
	}, function (err) {
		console.log(err);
		res.status(500).send({ error: 'could not update the repo' });
	});
});

var _manifestStoreExists = function _manifestStoreExists(API, user) {
	return new Promise(function (resolve, reject) {
		_superagent2.default.get(API + '/repos/' + user.username + '/databox-manifest-store').set('Accept', 'application/json').set('Authorization', 'token ' + user.accessToken).end(function (err, data) {

			if (data.body && data.body.message && data.body.message === "Not Found") {
				resolve(null);
				return;
			} else if (err) {
				resolve(null);
				return;
			}
			resolve(true);
		});
	});
};

var _createNewRepo = function _createNewRepo(options) {
	var config = options.config,
	    user = options.user,
	    repo = options.repo,
	    description = options.description,
	    message = options.message,
	    data = options.data;


	return new Promise(function (resolve, reject) {

		_superagent2.default.post(config.github.API + '/user/repos').send({
			"name": repo,
			"description": description,
			"private": false,
			"has_issues": false,
			"has_wiki": false,
			"has_downloads": false
		}).set('Authorization', 'token ' + user.accessToken).set('Accept', 'application/json').end(function (err, data) {
			if (err) {
				console.log("--> failed to create repo!");
				console.log(err);
				reject(err);
			} else {

				var result = data.body;

				//give github time it needs to set up repo

				setTimeout(function () {
					resolve({
						name: result.name,
						updated: result.updated_at,
						icon: result.owner.avatar_url,
						url: result.url
					});
				}, 2000);
			}
		});
	}).then(function (repo) {
		return _addFile({
			config: config,
			username: user.username,
			repo: repo.name,
			filename: data.name,
			email: user.email || user.username + '@me-box.com',
			message: message,
			content: data.value,
			accessToken: user.accessToken
		});
	});
};

var _fileExists = function () {
	var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(config, user, filename) {
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return _fetchFile(config, user.username, user.username, user.accessToken, "databox-manifest-store", filename).catch(function (err) {
							return false;
						});

					case 2:
						return _context2.abrupt('return', _context2.sent);

					case 3:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function _fileExists(_x6, _x7, _x8) {
		return _ref2.apply(this, arguments);
	};
}();

var _saveManifestToStore = function () {
	var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(config, user, content, filename) {
		var repo, file;
		return _regenerator2.default.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return _manifestStoreExists(config.github.API, user);

					case 2:
						repo = _context3.sent;

						if (repo) {
							_context3.next = 9;
							break;
						}

						_context3.next = 6;
						return _createNewRepo({ config: config, user: user, repo: "databox-manifest-store", description: "databox manifest store", message: "first commit", data: { name: filename, value: content } });

					case 6:
						return _context3.abrupt('return', _context3.sent);

					case 9:
						_context3.next = 11;
						return _fileExists(config, user, filename);

					case 11:
						file = _context3.sent;

						if (!file) {
							_context3.next = 18;
							break;
						}

						_context3.next = 15;
						return _createCommit(config, user, "databox-manifest-store", file.sha, filename, content, "update commit", user.accessToken);

					case 15:
						return _context3.abrupt('return', _context3.sent);

					case 18:
						_context3.next = 20;
						return _addFile({
							config: config,
							username: user.username,
							repo: "databox-manifest-store",
							filename: filename,
							email: user.email || user.username + '@me-box.com',
							message: "first commit",
							content: content,
							accessToken: user.accessToken
						});

					case 20:
						return _context3.abrupt('return', _context3.sent);

					case 21:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function _saveManifestToStore(_x9, _x10, _x11, _x12) {
		return _ref3.apply(this, arguments);
	};
}();

router.post('/publish', function () {
	var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
		var user, repo, manifest, flows, commitmessage, libraries, dockerfile, flowcontent, manifestcontent, dockerfilecontent, message, flowcommit, dockercommit, manifestcommit, reponame, _manifestcontent, values;

		return _regenerator2.default.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						user = req.user;
						repo = req.body.repo;
						manifest = (0, _extends3.default)({}, req.body.manifest, {
							datasources: [].concat((0, _toConsumableArray3.default)(req.body.manifest.datasources), [{
								type: "personalLoggerActuator",
								required: false,
								name: "personalLoggerActuator",
								clientid: "personalLoggerActuator",
								granularites: []
							}])
						});
						flows = req.body.flows;
						commitmessage = 'publish commit';

						(0, _websocket.sendmessage)(user.username, "debug", { msg: 'publishing manifest, ' + JSON.stringify(manifest, null, 4) });

						//first save the manifest and flows file - either create new repo or commit changes	
						libraries = (0, _utils.dedup)((0, _utils.flatten)(flows.reduce(function (acc, node) {
							if (node.type === "dbfunction") {
								acc = [].concat((0, _toConsumableArray3.default)(acc), [(0, _utils.matchLibraries)(node.func)]);
							}
							return acc;
						}, [])));

						//generate docker file

						dockerfile = _generateDockerfile(libraries, req.config, manifest.name);

						(0, _websocket.sendmessage)(user.username, "debug", { msg: 'dockerfile, ' + dockerfile });

						if (!(repo && repo.sha && repo.sha.flows && repo.sha.Dockerfile)) {
							_context4.next = 29;
							break;
						}

						//commit

						(0, _websocket.sendmessage)(user.username, "debug", { msg: 'commiting changes' });
						flowcontent = new Buffer(JSON.stringify(flows, null, 4)).toString('base64');
						manifestcontent = new Buffer(JSON.stringify(_formatmanifest(manifest, req.config, user), null, 4)).toString('base64');
						dockerfilecontent = new Buffer(dockerfile).toString('base64');
						message = commitmessage;
						_context4.next = 17;
						return _createCommit(req.config, user, repo.name, repo.sha.flows, 'flows.json', flowcontent, message, req.user.accessToken);

					case 17:
						flowcommit = _context4.sent;
						_context4.next = 20;
						return _createCommit(req.config, user, repo.name, repo.sha.Dockerfile, 'Dockerfile', dockerfilecontent, message, req.user.accessToken);

					case 20:
						dockercommit = _context4.sent;
						_context4.next = 23;
						return _saveManifestToStore(req.config, user, manifestcontent, repo.name + '-manifest.json');

					case 23:
						manifestcommit = _context4.sent;
						_context4.next = 26;
						return _buildImage(req.config, user, manifest, JSON.stringify(flows), dockerfile);

					case 26:
						res.send({
							result: 'success', repo: repo.name,
							sha: {
								flows: flowcommit.body.content.sha,
								Dockerfile: dockercommit.body.content.sha
							}
						});

						_context4.next = 39;
						break;

					case 29:
						reponame = manifest.name.toLowerCase();
						_manifestcontent = new Buffer(JSON.stringify(_formatmanifest(manifest, req.config, user), null, 4)).toString('base64');
						_context4.next = 33;
						return _createRepo(req.config, user, reponame, manifest.description, flows, dockerfile, commitmessage, req.user.accessToken);

					case 33:
						values = _context4.sent;
						_context4.next = 36;
						return _saveManifestToStore(req.config, req.user, _manifestcontent, reponame + '-manifest.json');

					case 36:
						_context4.next = 38;
						return _buildImage(req.config, user, manifest, JSON.stringify(flows), dockerfile);

					case 38:
						res.send({
							result: 'success',
							repo: repo.name,
							sha: {
								flows: values[1].content.sha,
								Dockerfile: values[2].content.sha
							}
						});

					case 39:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function (_x13, _x14) {
		return _ref4.apply(this, arguments);
	};
}());

router.post('/publishold', function (req, res) {

	var user = req.user;
	var repo = req.body.repo;
	var manifest = (0, _extends3.default)({}, req.body.manifest, {
		datasources: [].concat((0, _toConsumableArray3.default)(req.body.manifest.datasources), [{
			type: "personalLoggerActuator",
			required: false,
			name: "personalLoggerActuator",
			clientid: "personalLoggerActuator",
			granularites: []
		}])
	});

	var flows = req.body.flows;
	var packages = manifest.packages;
	var allowed = manifest['allowed-combinations'];
	var description = manifest.description;
	var commitmessage = 'publish commit';

	(0, _websocket.sendmessage)(user.username, "debug", { msg: 'publishing manifest, ' + JSON.stringify(manifest, null, 4) });

	//first save the manifest and flows file - either create new repo or commit changes	
	var libraries = (0, _utils.dedup)((0, _utils.flatten)(flows.reduce(function (acc, node) {
		if (node.type === "dbfunction") {
			acc = [].concat((0, _toConsumableArray3.default)(acc), [(0, _utils.matchLibraries)(node.func)]);
		}
		return acc;
	}, [])));

	var dockerfile = _generateDockerfile(libraries, req.config, manifest.name);

	(0, _websocket.sendmessage)(user.username, "debug", { msg: 'dockerfile, ' + dockerfile });

	if (repo && repo.sha && repo.sha.flows && repo.sha.manifest && repo.sha.Dockerfile) {
		//commit

		(0, _websocket.sendmessage)(user.username, "debug", { msg: 'commiting changes' });
		var flowcontent = new Buffer(JSON.stringify(flows, null, 4)).toString('base64');
		var manifestcontent = new Buffer(JSON.stringify(_formatmanifest(manifest), null, 4)).toString('base64');
		var dockerfilecontent = new Buffer(dockerfile).toString('base64');

		var message = commitmessage;

		return _createCommit(req.config, user, repo.name, repo.sha.flows, 'flows.json', flowcontent, message, req.user.accessToken).then(function (data) {
			return Promise.all([Promise.resolve(data.body.content.sha), _createCommit(req.config, user, repo.name, repo.sha.manifest, 'databox-manifest.json', manifestcontent, message, req.user.accessToken)]);
		}, function (err) {
			(0, _websocket.sendmessage)(user.username, "debug", { msg: 'error commiting ' + JSON.stringify(err) });
			res.status(500).send({ error: err });
		}).then(function (values) {
			return Promise.all([Promise.resolve(values[0]), Promise.resolve(values[1].body.content.sha), _createCommit(req.config, user, repo.name, repo.sha.Dockerfile, 'Dockerfile', dockerfilecontent, message, req.user.accessToken)]);
		}).then(function (values) {
			return Promise.all([Promise.resolve(values[0]), Promise.resolve(values[1]), Promise.resolve(values[2].body.content.sha), _publish(req.config, user, manifest, JSON.stringify(flows), dockerfile)]);
		}, function (err) {
			res.status(500).send({ error: err });
		}).then(function (values) {

			res.send({
				result: 'success',
				repo: repo.name,
				sha: {
					flows: values[0],
					manifest: values[1],
					Dockerfile: values[2]
				}
			});
		});
	} else {
		//create a new repo!

		var reponame = manifest.name.toLowerCase();
		(0, _websocket.sendmessage)(user.username, "debug", { msg: 'creating a new repo ' + reponame });

		return _createRepo(req.config, user, reponame, manifest.description, flows, dockerfile, commitmessage, req.user.accessToken).then(function (values) {
			return Promise.all([Promise.resolve(values), _publish(req.config, user, manifest, JSON.stringify(flows), dockerfile)]);
		}, function (err) {
			console.log("error creating repo", err.response.text);
			(0, _websocket.sendmessage)(user.username, "debug", { msg: err.response.text });
			res.status(500).send({ error: err });
		}).then(function (values) {
			var repodetails = values[0];

			res.send({
				result: 'success',
				repo: repodetails[0],
				sha: {
					flows: repodetails[1].content.sha,
					manifest: repodetails[2].content.sha,
					Dockerfile: repodetails[3].content.sha
				}
			});
		});
	}
});

module.exports = router;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("dockerode");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("tar-stream");

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _toConsumableArray2 = __webpack_require__(5);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _superagent = __webpack_require__(10);

var _superagent2 = _interopRequireDefault(_superagent);

var _docker = __webpack_require__(6);

var _docker2 = _interopRequireDefault(_docker);

var _stream = __webpack_require__(31);

var _stream2 = _interopRequireDefault(_stream);

var _websocket = __webpack_require__(4);

var _utils = __webpack_require__(12);

var _minimist = __webpack_require__(3);

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
//import net from 'net';
//import JsonSocket from 'json-socket';


var argv = (0, _minimist2.default)(process.argv.slice(2));
var DEVMODE = argv.dev || false;
var network = "bridge";
var streams = {};

var _postFlows = function _postFlows(ip, port, data, username) {
	var attempts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

	console.log('connecting to ' + ip + ':' + port + '/flows');
	username = username.toLowerCase();

	//add in channelIDs here
	console.log('adding output types');
	var flows = data.map(function (node) {
		var outputtypes = ["app", "debugger", "bulbsout", "plugout"];
		var modifier = outputtypes.indexOf(node.type) != -1 ? { appId: username } : {}; //inject the appID
		return (0, _extends3.default)({}, node, modifier);
	});

	return new Promise(function (resolve, reject) {

		if (attempts > 5) {
			reject("sorry couldn't connect to the container!");
			return;
		}

		_superagent2.default.post(ip + ':' + port + '/flows').send(flows).set('Accept', 'application/json').type('json').end(function (err, result) {
			if (err) {
				console.log("error posting new flows", err);
				setTimeout(function () {
					attempts += 1;
					console.log("retrying ", attempts);
					_postFlows(ip, port, data, username, attempts);
				}, 1000);
			} else {
				console.log("successfully installed new flows");
				resolve(true);
			}
		});
	});
};

/*  after a container has started it'll take a bit of time initing, after which we need to send it a flow file
    the only way I can think of to be sure it is ready to receive this is to monitor the container stdout and
    look for "Started Flows", and send the flow file a second after this */
var _waitForStart = function _waitForStart(container, username) {
	var showonconsole = true;
	username = username.toLowerCase();
	return new Promise(function (resolve, reject) {

		container.attach({ stream: true, stdout: true, stderr: true }, function (err, stream) {
			stream.on('data', function (line) {
				var str = line.toString("utf-8", 8, line.length);

				(0, _websocket.sendmessage)(username, "debug", { msg: str });

				if (showonconsole) {
					console.log('' + str);
				}
				if (str.indexOf("Started flows") != -1) {
					//console.log("container ready for flows");
					showonconsole = false;
					setTimeout(function () {
						console.log("posting flows");
						resolve(true);
					}, 1000);
				}
			});
		});
	});
};

var _pullContainer = function _pullContainer(name, username) {
	console.log("pulling container", name);
	username = username.toLowerCase();
	return _docker2.default.pull(name).then(function (stream, err) {
		return new Promise(function (resolve, reject) {
			if (err) {
				console.log("error pulling container!", err);
				(0, _websocket.sendmessage)(username, "debug", { msg: err.json.message });
				reject(err);
				return;
			}
			var pulled = function pulled() {
				console.log("successfully pulled container");
				(0, _websocket.sendmessage)(username, "debug", { msg: "successfully pulled container" });
				resolve("complete!");
			};

			var pulling = function pulling(event) {
				console.log('[pulling]: ' + event.toString());
				(0, _websocket.sendmessage)(username, "debug", { msg: '[pulling]: ' + JSON.stringify(event) });
			};

			return _docker2.default.modem.followProgress(stream, pulled, pulling);
		});
	});
};

var _fetchAddr = function _fetchAddr(cdata) {
	if (DEVMODE) {
		return {
			ip: "127.0.0.1",
			port: cdata['NetworkSettings']['Ports']['1880/tcp'][0]['HostPort']
		};
	}
	return {
		ip: cdata.NetworkSettings.Networks[network].IPAddress,
		port: 1880
	};
};

var _fetchRunningAddr = function _fetchRunningAddr(c) {
	console.log("FETCHING RUNNING ADDR");

	if (DEVMODE) {
		console.log("in dev mode!");
		return {

			ip: "127.0.0.1",

			port: c.Ports.reduce(function (acc, obj) {
				if (obj.PrivatePort == 1880) acc = obj.PublicPort;
				return acc;
			}, 0)
		};
	}
	console.log("ok getting ip, port from", c);

	return {
		ip: c.NetworkSettings.Networks[network].IPAddress,
		port: 1880
		//c.Ports[0].PrivatePort,
	};
};

var _inspect = function _inspect(container) {
	return new Promise(function (resolve, reject) {
		container.inspect(function (err, cdata) {
			if (err) {
				reject(err);
			} else {
				resolve(cdata);
			}
		});
	});
};

var _startContainer = function _startContainer(container, flows, username) {
	username = username.toLowerCase();
	return _waitForStart(container, username).then(function () {
		return _inspect(container);
	}).then(function (cdata) {
		var _fetchAddr2 = _fetchAddr(cdata),
		    ip = _fetchAddr2.ip,
		    port = _fetchAddr2.port;

		return _postFlows(ip, port, flows, username);
	}, function (err) {
		console.log(err);
		(0, _websocket.sendmessage)(username, "debug", { msg: err.json.message });
		throw err;
	});
};

var _createNewImageAndContainer = function _createNewImageAndContainer(libraries, username, flows) {
	//need to create a new Image!
	console.log("found external libraries, so creating new image!");

	(0, _websocket.sendmessage)(username, "debug", { msg: "found external libraries, so creating new image!" });

	var libcommands = libraries.map(function (library) {
		return 'RUN cd /data/nodes/databox && npm install --save ' + library;
	});

	var dcommands = ['FROM tlodge/databox-tester', 'ADD flows.json /data/flows.json'].concat((0, _toConsumableArray3.default)(libcommands));
	var dockerfile = dcommands.join("\n");

	console.log(dockerfile);

	var path = 'tmp-' + username.toLowerCase() + '.tar.gz';

	return _pullContainer("tlodge/databox-tester:latest", username).then(function () {
		return (0, _utils.stopAndRemoveContainer)(username.toLowerCase() + '-tester');
	}).then(function () {
		return (0, _utils.createTarFile)(dockerfile, JSON.stringify(flows), path);
	}).then(function (tarfile) {
		console.log('created tar file ' + tarfile);
		return (0, _utils.createDockerImage)(tarfile, username.toLowerCase() + '-testimage');
	}).then(function (image) {
		console.log("creating test container!");
		return (0, _utils.createTestContainer)(image, username.toLowerCase(), network);
	}, function (err) {
		console.log("error creating test container!!");
		(0, _websocket.sendmessage)(username, "debug", { msg: err.json.message });
	}).then(function (container) {
		console.log("successfully created container");
		return _startContainer(container, flows, username);
	}, function (err) {
		(0, _websocket.sendmessage)(username, "debug", { msg: err.json.message });
	});
};

var _listContainers = function _listContainers() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return new Promise(function (resolve, reject) {
		_docker2.default.listContainers(options, function (err, containers) {
			if (err) {
				reject(containers);
			} else {
				resolve(containers);
			}
		});
	});
};

var _restart = function _restart(container) {
	return new Promise(function (resolve, reject) {
		container.restart({}, function (err, data) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

var _containerLogs = function _containerLogs(container, username) {
	username = username.toLowerCase();
	// create a single stream for stdin and stdout
	var logStream = new _stream2.default.PassThrough();

	logStream.on('data', function (chunk) {
		//console.log(chunk.toString('utf8'));
		(0, _websocket.sendmessage)(username, "debug", { msg: chunk.toString('utf8') });
	});

	container.logs({
		follow: true,
		stdout: true,
		stderr: true
	}, function (err, stream) {
		if (err) {
			return err.message;
		}
		container.modem.demuxStream(stream, logStream, logStream);
		stream.on('end', function () {
			logStream.end('!stop!');
		});
	});
};

var _startNewContainer = function _startNewContainer(username, flows) {
	username = username.toLowerCase();

	return _pullContainer("tlodge/databox-tester:latest", username).then(function () {
		return (0, _utils.createTestContainer)('tlodge/databox-tester', username, network);
	}, function (err) {
		(0, _websocket.sendmessage)(username, "debug", { msg: err.json.message });
	}).then(function (container) {
		return _startContainer(container, flows, username);
	}, function (err) {
		(0, _websocket.sendmessage)(username, "debug", { msg: err.json.message });
	});
};
//stop and remove image regardless of whether it is running already or not.  This will deal with teh problem where
//the test web app responds to the client webpage before it has been given the details of the new app.
var _createContainerFromStandardImage = function _createContainerFromStandardImage(username, flows) {
	//username = `${username}${Math.round(Math.random()*50)}`;
	username = username.toLowerCase();
	var opts = {
		filters: {
			label: ['user=' + username],
			status: ['running', "exited"]
		}
	};

	return _listContainers(opts).then(function (containers) {
		return containers;
	}, function (err) {
		return err;
	}).then(function (containers) {
		console.log('Containers labeled user=' + username + ' ' + containers.length);

		//create a new container and start it, if it doesn't exist
		if (containers.length <= 0) {
			console.log("creating test container");
			(0, _websocket.sendmessage)(username, "debug", { msg: "creating test container" });
			return _startNewContainer(username, flows);
		} else {
			var c = containers[0];

			//restart the container if it exists but is stopped
			if (c.State === 'exited') {
				//console.log("restarting container");
				(0, _websocket.sendmessage)(username, "debug", { msg: "restarting container" });
				var container = _docker2.default.getContainer(c.Id);
				return _restart(container).then(function (cdata) {
					return _startContainer(container, flows, username);
				}, function (err) {
					(0, _websocket.sendmessage)(username, "debug", { msg: err.json.message });
					return err;
				});
			} else {

				(0, _websocket.sendmessage)(username, "debug", { msg: "container already running, so removing" });

				return (0, _utils.stopAndRemoveContainer)(username.toLowerCase() + '-tester').then(function () {
					_startNewContainer(username, flows);
				});

				/*if (!streams[c.Id]){
    	const container = docker.getContainer(c.Id);
    	streams[c.Id] = true;
    	_containerLogs(container, username);
    }*/

				//const {ip, port} = _fetchRunningAddr(c);
				//console.log("posting new flows to", ip, port);
				//return _postFlows(ip, port, flows, username);
			}
		}
	});
};

router.post('/flows', function (req, res) {

	var flows = req.body;

	var libraries = (0, _utils.dedup)((0, _utils.flatten)(req.body.reduce(function (acc, node) {
		if (node.type === "dbfunction") {
			acc = [].concat((0, _toConsumableArray3.default)(acc), [(0, _utils.matchLibraries)(node.func)]);
		}
		return acc;
	}, [])));

	if (libraries.length > 0) {
		return _createNewImageAndContainer(libraries, req.user.username.toLowerCase(), flows).then(function (result) {
			res.send({ success: true });
		}, function (err) {
			res.status(500).send({ error: err });
		});
	} else {
		return _createContainerFromStandardImage(req.user.username.toLowerCase(), flows).then(function (result) {
			res.send({ success: true });
		}, function (err) {
			res.status(500).send({ error: err });
		});
	}
});

module.exports = router;

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:sensor', function (req, res) {

	var sensor = req.params.sensor;

	if (!sensor) {
		res.send({ success: false, error: "no sensor provided" });
		return;
	}

	var valid = /^[a-zA-Z]+$/.test(sensor);

	if (!valid) {
		console.log("invalid sensor requested!");
		res.send({ success: false, error: "invalid sensor type" });
		return;
	}

	_fs2.default.readFile('./static/samples/' + sensor + '.json', 'utf8', function (err, data) {
		if (err) {
			console.log(err);
			res.send({ success: false, error: err });
			return;
		}
		try {

			res.send({ success: true, data: JSON.parse(data) });
			return;
		} catch (err) {
			console.log(err);
			res.send({ success: false, error: "failed to read sensor data" });
			return;
		}
	});
});

module.exports = router;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(11);

var _path2 = _interopRequireDefault(_path);

var _minimist = __webpack_require__(3);

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Promise = __webpack_require__(34);
Promise.promisifyAll(_fs2.default);
var argv = (0, _minimist2.default)(process.argv.slice(2));
var router = _express2.default.Router();

var ROOTDIR = argv.dev ? _path2.default.join(__dirname, '../static/uibuilder/') : _path2.default.join(__dirname, '/static/uibuilder/');

router.post('/scene/add', function (req, res) {
  var DIRECTORY = _path2.default.join(ROOTDIR, '/scenes/');

  var _req$body = req.body,
      name = _req$body.name,
      scene = _req$body.scene;


  var ts = Date.now();
  var filename = _path2.default.join(DIRECTORY, ts + '_' + name + '.scene');

  _fs2.default.writeFileAsync(filename, scene).then(function () {
    res.send({ success: true });
  }, function (err) {
    res.send({ success: false });
  });
});

router.get('/scenes/:name', function (req, res) {
  res.sendFile(_path2.default.join(ROOTDIR, '/scenes/' + req.params.name));
});

router.get('/scenes/', function (req, res) {
  _fs2.default.readdir(_path2.default.join(ROOTDIR, '/scenes/'), function (err, files) {

    files = files || [];

    var scenes = files.filter(function (fileName) {
      return fileName.indexOf(".scene") != -1;
    });

    /*const scenes = images.map((fileName)=>{
       
         const f = path.join(__dirname, `./src/client/assets/images/${fileName}`);
       
        var contents = fs.readFileSync(f, 'utf8');
        
        return {
            image: fileName,
            body: contents,
        }
    });*/

    res.send(scenes);
  });
});

//just dev, so blocking read of images dir
router.get('/images/', function (req, res) {

  console.log("reading images from ", _path2.default.join(ROOTDIR, '/images/'));

  _fs2.default.readdir(_path2.default.join(ROOTDIR, '/images/'), function (err, files) {

    if (!files || err) {
      console.log(err);
      res.send([]);
      return;
    }

    var images = files.filter(function (fileName) {
      return fileName.indexOf(".svg") != -1;
    });

    var data = images.map(function (fileName) {

      var f = _path2.default.join(ROOTDIR, '/images/' + fileName);

      var contents = _fs2.default.readFileSync(f, 'utf8');

      return {
        image: fileName,
        body: contents
      };
    });
    console.log("sending data", data);
    res.send(data);
  });
});

router.get('/images/:name', function (req, res) {
  res.sendFile(_path2.default.join(ROOTDIR, '/images/' + req.params.name));
});

router.post('/image/add', function (req, res) {

  var DIRECTORY = _path2.default.join(ROOTDIR, '/images/');

  var _req$body2 = req.body,
      name = _req$body2.name,
      image = _req$body2.image;

  //var data = image.replace(/^data:image\/\w+;base64,/, "");
  //var buf = new Buffer(data, 'base64');

  var filename = _path2.default.join(DIRECTORY, name);

  _fs2.default.writeFileAsync(filename, image).then(function () {
    res.send({ success: true });
  }, function (err) {
    console.log(err);
    res.send({ success: false });
  });
});

module.exports = router;

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("ejs");

/***/ })
/******/ ]);