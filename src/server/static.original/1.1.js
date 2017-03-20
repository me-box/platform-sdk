webpackJsonp([1],{

/***/ 194:
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reducer = __webpack_require__(195);

	var _redux = __webpack_require__(156);

	var _actions = __webpack_require__(196);

	var Actions = _interopRequireWildcard(_actions);

	var _RegisterActions = __webpack_require__(197);

	var RegisterActions = _interopRequireWildcard(_RegisterActions);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BNode = function (_Component) {
		_inherits(BNode, _Component);

		function BNode(props) {
			_classCallCheck(this, BNode);

			var _this = _possibleConstructorReturn(this, _Component.call(this, props));

			Object.assign.apply(Object, [_this].concat((0, _redux.bindActionCreators)(Actions, props.dispatch), (0, _redux.bindActionCreators)(RegisterActions, props.dispatch)));
			return _this;
		}

		BNode.prototype.componentWillMount = function componentWillMount() {
			this.props.register("bnodereducer", _reducer.reducer);
		};

		BNode.prototype.componentDidMount = function componentDidMount() {
			this.registerType('sample', {
				category: 'input', // the palette category
				color: '#a6bbcf',
				defaults: { // defines the editable properties of the node
					name: { value: "" }, //  along with default values.
					topic: { value: "", required: true }
				},
				inputs: 1, // set the number of inputs - only 0 or 1
				outputs: 1, // set the number of outputs - 0 to n
				// set the icon (held in icons dir below where you save the node)
				icon: "myicon.png", // saved in  icons/myicon.png
				label: function label() {
					// sets the default label contents
					return this.name || this.topic || "sample";
				},
				labelStyle: function labelStyle() {
					// sets the class to apply to the label
					return this.name ? "node_label_italic" : "";
				}
			});
		};

		BNode.prototype.render = function render() {

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'h1',
					{ onClick: this.testAction.bind(this, "") },
					' Hello ',
					this.props.data
				)
			);
		};

		return BNode;
	}(_react.Component);

	BNode.propTypes = {
		register: _react2.default.PropTypes.func,
		dispatch: _react2.default.PropTypes.func
	};

	exports.default = BNode;

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "b.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },

/***/ 195:
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	"use strict";

	exports.__esModule = true;
	exports.reducer = reducer;

	var _ActionTypes = __webpack_require__(169);

	function reducer() {
			var state = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var action = arguments[1];

			switch (action.type) {
					case _ActionTypes.TEST_ACTION:
							console.log("ok I have seen a test action!");
							console.log(action);
							return state + 1;
					default:
							return state;
			}
	}

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "reducer.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },

/***/ 196:
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	exports.__esModule = true;
	exports.testAction = testAction;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _ActionTypes = __webpack_require__(169);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function testAction() {
	  return {
	    type: _ActionTypes.TEST_ACTION
	  };
	}

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "actions.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },

/***/ 197:
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	exports.__esModule = true;
	exports.registerType = registerType;

	var _ActionTypes = __webpack_require__(169);

	function registerType(name, def) {
	  return {
	    type: _ActionTypes.REGISTER_TYPE,
	    name: name,
	    def: def
	  };
	}

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("/Users/tomlodge/iot/iot.red/node-red-react-editor/node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "RegisterActions.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ }

});