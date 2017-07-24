var testbulb =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./cells.scss", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./cells.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _node = __webpack_require__(2);

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {

    category: 'datastores',

    color: '#ccff00',

    defaults: {
        name: { value: "" },
        subtype: { value: "bulb-on" }

    },

    schemakey: "subtype",

    inputs: 0,

    outputs: 1,

    icon: "fa-lightbulb-o",

    unicode: '\uF0EB',

    label: function label() {
        return this.name || this.topic || "testbulb";
    },

    schemafn: function schemafn(subtype) {
        var type = subtype || "bulb-on";

        var payloads = {
            "bulb-on": { type: "string", description: "<i>on</i> or <i>off</i>" },
            "bulb-hue": { type: "number", description: "a hue value (0-360)" },
            "bulb-bri": { type: "number", description: "a brightness value (0-255)" }
        };

        return {
            output: {
                type: "object",
                description: "the container object",
                properties: {
                    name: { type: 'string', description: "a name assigned to this bulb" },
                    id: { type: 'string', description: "the node id: [id]" },
                    type: { type: 'string', description: 'the type:\'bulbs-in\'' },
                    subtype: { type: 'string', description: 'reading type:\'' + type + '\'' },
                    payload: {
                        type: 'object',
                        description: 'the payload object',
                        properties: {
                            ts: { type: 'time', description: 'a unix timestamp' },
                            value: payloads[type]
                        },
                        required: ["ts", "value"]
                    }
                },
                required: ["id", "type", "subtype", "payload"]
            }
        };
    },

    descriptionfn: function descriptionfn(subtype) {
        switch (subtype) {
            case "bulb-on":
                return "use to determine whether a bulb is on or off";
            case "bulb-hue":
                return "use to access the hue bulb's hue setting";
            case "bulb-bri":
                return "use to access the hue bulb's brightness setting";
            default:
                return "unknown setting";
        }
    }
};

exports.default = {
    type: "testbulb",
    def: Object.assign({ _: function _(id) {
            return id;
        } }, config, { nodetype: "testbulb" }),
    node: _node2.default
};
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _Cell = __webpack_require__(3);

var _Cell2 = _interopRequireDefault(_Cell);

var _Cells = __webpack_require__(8);

var _Cells2 = _interopRequireDefault(_Cells);

var _Textfield = __webpack_require__(9);

var _Textfield2 = _interopRequireDefault(_Textfield);

var _Select = __webpack_require__(10);

var _Select2 = _interopRequireDefault(_Select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ConfigNode = ConfigNode,
    configNode = _ConfigNode.configNode;
var Node = (_dec = configNode(), _dec(_class = function (_React$Component) {
  _inherits(Node, _React$Component);

  function Node() {
    _classCallCheck(this, Node);

    return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).apply(this, arguments));
  }

  _createClass(Node, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          node = _props.node,
          _props$values = _props.values,
          values = _props$values === undefined ? {} : _props$values,
          updateNode = _props.updateNode,
          updateOutputSchema = _props.updateOutputSchema;


      var nameprops = {
        id: "name",
        placeholder: "name",
        value: values.name || "",
        onChange: function onChange(property, event) {
          updateNode(property, event.target.value);
        }
      };

      var typeprops = {

        id: "subtype",
        placeholder: "select a subtype",

        options: [{ name: 'on', value: 'bulb-on' }, { name: 'hue', value: 'bulb-hue' }, { name: 'brightness', value: 'bulb-bri' }],

        label: "subtype",
        itemLabel: "name",
        itemValue: "value",

        onSelect: function onSelect(event) {
          updateNode("subtype", event.target.value);
        },

        helpText: "Select a subtype!",
        value: values.subtype || ""
      };

      var typeinput = React.createElement(
        'div',
        { className: 'centered' },
        React.createElement(_Select2.default, typeprops)
      );

      var nameinput = React.createElement(
        'div',
        { className: 'centered' },
        React.createElement(_Textfield2.default, nameprops)
      );

      return React.createElement(
        'div',
        null,
        React.createElement(
          _Cells2.default,
          null,
          React.createElement(_Cell2.default, { title: "name", content: nameinput }),
          React.createElement(_Cell2.default, { title: "type", content: typeinput })
        )
      );
    }
  }]);

  return Node;
}(React.Component)) || _class);
exports.default = Node;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cell = function (_React$Component) {
	_inherits(Cell, _React$Component);

	function Cell(props) {
		_classCallCheck(this, Cell);

		return _possibleConstructorReturn(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).call(this, props));
	}

	_createClass(Cell, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ className: 'flexrow', style: { flexBasis: 0, overflow: 'auto' } },
					this.props.title && React.createElement(
						'div',
						{ className: 'title' },
						React.createElement(
							'div',
							{ className: 'centered' },
							this.props.title
						)
					),
					React.createElement(
						'div',
						null,
						this.props.content
					)
				)
			);
		}
	}]);

	return Cell;
}(React.Component);

;

exports.default = Cell;
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "html {\n  -webkit-font-smoothing: antialiased; }\n\n*, *:before, *:after {\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box; }\n\n#nodeeditor code {\n  white-space: normal; }\n\n.flexcolumn {\n  width: inherit;\n  height: inherit;\n  display: -webkit-flex;\n  display: flex;\n  flex: 1 1 auto;\n  -webkit-flex: 1 1 auto;\n  -webkit-flex-direction: column;\n  flex-direction: column; }\n\n.flexcolumn > div.noborder {\n  border: none; }\n\n#schemas .flexcolumn > div {\n  flex: 0 0 auto;\n  -webkit-flex: 0 0 auto; }\n\n.flexcolumn > div {\n  display: -webkit-flex;\n  display: flex;\n  flex: 1 1 auto;\n  -webkit-flex: 1 1 auto;\n  border-bottom: 1px solid #b6b6b6;\n  min-height: 40px; }\n\n.flexrow {\n  display: -webkit-flex;\n  display: flex;\n  flex: 1 1 auto;\n  -webkit-flex: 1 1 auto;\n  -webkit-flex-direction: row;\n  flex-direction: row; }\n\n.flexrow > div {\n  display: -webkit-flex;\n  display: flex;\n  flex: 1 1 auto;\n  -webkit-flex: 1 1 auto; }\n\n.flexrow > div.fixed {\n  -webkit-flex: 0 0 auto;\n  flex: 0 0 auto; }\n\n.centered {\n  margin: auto;\n  text-align: center;\n  width: 100%; }\n\n.description {\n  background: #d3d3d3; }\n\n.greyed {\n  opacity: 0.5; }\n\n.flexcolumn > .headerstyle {\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex: 0 0 auto;\n  flex: 0 0 auto;\n  height: 40px;\n  background: #445662;\n  color: white; }\n\n.flexcolumn > .statusstyle {\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex: 0 0 auto;\n  flex: 0 0 auto;\n  height: 40px;\n  color: white;\n  background: #d45500; }\n\n.flexcolumn > .footerstyle {\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex: 0 0 auto;\n  flex: 0 0 auto;\n  height: 40px; }\n\n.flexrow > .title,\n.flexrow > .attributetitle {\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex: 0 0 auto;\n  flex: 0 0 auto;\n  width: 118px;\n  border-right: 1px solid #b6b6b6;\n  border-left: 1px solid #b6b6b6;\n  background: #f2f2f2;\n  font-size: 0.75em; }\n\n.flexrow > .title {\n  text-transform: uppercase; }\n\n.flexrow > .header {\n  display: -webkit-flex;\n  display: flex;\n  border-right: 1px solid #b6b6b6;\n  background: #f2f2f2;\n  text-transform: uppercase;\n  font-size: 0.75em; }\n\n.flexrow > .disabled {\n  display: -webkit-flex;\n  display: flex;\n  background: #f2f2f2; }\n\n.flexrow .icon {\n  display: -webkit-flex;\n  display: flex;\n  flex: 0 1 50px;\n  width: 50px;\n  padding: 5px; }\n\n.flexrow .icon img {\n  height: 50px;\n  margin: auto;\n  object-fit: cover; }\n\n.flexrow > .submit {\n  display: -webkit-flex;\n  display: flex;\n  flex: 0 1 auto;\n  width: 70px; }\n\n.button {\n  margin: auto;\n  padding: 9px;\n  color: #727272;\n  text-transform: uppercase; }\n\n#sidebar .button.selected {\n  height: 30px;\n  line-height: 30px;\n  padding: 0; }\n\n.button.selected {\n  background: #d35a51;\n  color: white;\n  border: 1px solid white;\n  height: 40px;\n  margin: 0px;\n  width: 100%;\n  text-align: center; }\n\n#repomanager input {\n  margin-top: 5px;\n  margin-bottom: 5px; }\n\n#nodeeditor hr {\n  margin-top: 0.4em;\n  margin-bottom: 0.4em;\n  -webkit-margin-before: 0.4em;\n  -webkit-margin-after: 0.4em; }\n\n#nodeeditor select,\n#sidebar input[type=\"text\"],\n#publisher input[type=\"text\"],\n#nodeeditor input[type=\"text\"],\n.ui-dialog input[type=\"text\"],\n.ui-dialog select {\n  width: 100%;\n  height: inherit;\n  border-radius: 0;\n  margin: 0px;\n  height: 40px;\n  border: none;\n  padding: 0px 0px 0px 10px;\n  box-shadow: none; }\n\n#publisher .flexcontainer textarea,\n#nodeeditor textarea,\n.ui-dialog textarea {\n  width: 100%;\n  border-radius: 0;\n  padding: 0px 0px 0px 10px;\n  margin: 0;\n  height: 70px;\n  border: none; }\n\n.flexcontainer textarea, .repocontainer textarea,\n.ui-dialog textarea {\n  width: 100%;\n  height: inherit;\n  margin: 0;\n  padding: 0;\n  border-radius: 0;\n  border: none; }\n\n.flexcontainer {\n  display: -webkit-flex;\n  display: flex;\n  width: inherit;\n  /*height: inherit;*/\n  -webkit-flex-direction: column;\n  flex-direction: column; }\n\n.repocontainer {\n  display: -webkit-flex;\n  display: flex;\n  width: inherit;\n  height: inherit;\n  -webkit-flex-direction: column;\n  flex-direction: column; }\n\n.publishernode {\n  height: 4em;\n  width: 4em;\n  color: #fff;\n  border: 2px solid white;\n  line-height: 5.5em;\n  text-align: center;\n  box-shadow: 5px 0px 7px -3px rgba(0, 0, 0, 0.36);\n  margin: 10px; }\n\n.text {\n  background: #d45500;\n  color: white;\n  padding: 10px;\n  font-size: 1.2em; }\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cells = function (_React$Component) {
	_inherits(Cells, _React$Component);

	function Cells(props) {
		_classCallCheck(this, Cells);

		return _possibleConstructorReturn(this, (Cells.__proto__ || Object.getPrototypeOf(Cells)).call(this, props));
	}

	_createClass(Cells, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "flexcolumn" },
				this.props.children
			);
		}
	}]);

	return Cells;
}(React.Component);

;

exports.default = Cells;
module.exports = exports["default"];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Textfield = (_temp = _class = function (_React$Component) {
	_inherits(Textfield, _React$Component);

	function Textfield() {
		_classCallCheck(this, Textfield);

		return _possibleConstructorReturn(this, (Textfield.__proto__ || Object.getPrototypeOf(Textfield)).apply(this, arguments));
	}

	_createClass(Textfield, [{
		key: "render",
		value: function render() {
			var _props = this.props,
			    value = _props.value,
			    name = _props.name,
			    onChange = _props.onChange,
			    icon = _props.icon,
			    _props$style = _props.style,
			    style = _props$style === undefined ? {} : _props$style;

			var id = this.props.id || name;

			var label = void 0;

			var props = {
				value: value,
				onChange: onChange.bind(this, id),
				placeholder: this.props.placeholder || ""
			};

			if (name && icon) {
				label = React.createElement(
					"label",
					null,
					React.createElement("i", { className: this.props.icon }),
					React.createElement(
						"span",
						{ "data-i18n": "common.label.name" },
						name
					)
				);
			}
			return React.createElement(
				"div",
				null,
				label,
				React.createElement("input", _extends({ style: style, type: "text" }, props))
			);
		}
	}]);

	return Textfield;
}(React.Component), _class.defaultProps = {
	icon: "fa fa-tag"
}, _temp);
exports.default = Textfield;
module.exports = exports["default"];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Select = (_temp = _class = function (_React$Component) {
    _inherits(Select, _React$Component);

    function Select() {
        _classCallCheck(this, Select);

        return _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).apply(this, arguments));
    }

    _createClass(Select, [{
        key: "render",
        value: function render() {

            var options = this.props.options.map(function (option) {
                return React.createElement(
                    "option",
                    { key: option.value, value: option.value },
                    option.name
                );
            });

            return React.createElement(
                "select",
                { onChange: this.props.onSelect, value: this.props.value, style: this.props.style },
                options
            );
        }
    }]);

    return Select;
}(React.Component), _class.defaultProps = {
    onSelect: function onSelect() {
        console.warn("selected item, but not doing anytthing with it!");
    },
    style: {}
}, _temp);
exports.default = Select;
module.exports = exports["default"];

/***/ })
/******/ ]);