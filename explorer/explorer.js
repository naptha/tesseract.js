"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function array_join(array, glue) {
	var new_array = [];
	for (var i = 0; i < array.length; i++) {
		new_array.push(array[i]);
		if (i != array.length - 1) new_array.push(glue);
	}
	return new_array;
}

var Node = (function (_React$Component) {
	function Node(props) {
		var _this = this;

		_classCallCheck(this, Node);

		_get(Object.getPrototypeOf(Node.prototype), "constructor", this).call(this, props);

		this.toggleExpand = function (e) {
			_this.setState({ expanded: !_this.state.expanded });
		};

		this.state = {
			expanded: props.expanded
		};
	}

	_inherits(Node, _React$Component);

	_createClass(Node, [{
		key: "render",
		value: function render() {
			var _props = this.props;
			var node = _props.node;
			var label = _props.label;
			var expanded = this.state.expanded;

			var rep;
			if (typeof node === "string") {
				rep = React.createElement(TextNode, { html: label === "html", node: node, className: "clickable", onClick: this.toggleExpand, toggleExpand: this.toggleExpand, expanded: expanded });
			} else if (typeof node === "boolean") {
				rep = React.createElement(BooleanNode, { node: node, className: "clickable", onClick: this.toggleExpand, toggleExpand: this.toggleExpand, expanded: expanded });
			} else if (typeof node === "number") {
				rep = React.createElement(NumberNode, { node: node, className: "clickable", onClick: this.toggleExpand, toggleExpand: this.toggleExpand, expanded: expanded });
			} else if (Array.isArray(node)) {
				rep = React.createElement(ListNode, { node: node, className: "clickable", onClick: this.toggleExpand, toggleExpand: this.toggleExpand, expanded: expanded });
			} else {
				rep = React.createElement(ObjectNode, { node: node, className: "clickable", onClick: this.toggleExpand, toggleExpand: this.toggleExpand, expanded: expanded });
			}

			if (!label) {
				return rep;
			}

			return React.createElement(
				"span",
				null,
				React.createElement(
					"span",
					{ className: "label clickable", onClick: this.toggleExpand },
					label
				),
				": ",
				rep
			);
		}
	}]);

	return Node;
})(React.Component);

var TextNode = (function (_React$Component2) {
	function TextNode() {
		_classCallCheck(this, TextNode);

		_get(Object.getPrototypeOf(TextNode.prototype), "constructor", this).apply(this, arguments);
	}

	_inherits(TextNode, _React$Component2);

	_createClass(TextNode, [{
		key: "render",
		value: function render() {
			var _props2 = this.props;
			var node = _props2.node;
			var expanded = _props2.expanded;
			var html = _props2.html;
			var toggleExpand = _props2.toggleExpand;

			if (expanded) {
				var content = node;
				if (html) {
					var content = [];
					CodeMirror.runMode(node, { name: "xml", htmlMode: true }, function (text, className) {
						content.push(React.createElement(
							"span",
							{ className: "cm-" + className },
							text
						));
					});
				}
				return React.createElement(
					"span",
					{ className: (html ? "cm-s-default html " : "") + "textNode expanded clickable", onClick: toggleExpand },
					content
				);
			} else {
				return React.createElement(
					"span",
					null,
					React.createElement(
						"span",
						{ className: (html ? "html " : "") + "textNode clickable", onClick: toggleExpand },
						node.substring(0, 30)
					),
					node.length > 30 ? React.createElement(Ellipsis, null) : ""
				);
			}
		}
	}]);

	return TextNode;
})(React.Component);

var BooleanNode = (function (_React$Component3) {
	function BooleanNode() {
		_classCallCheck(this, BooleanNode);

		_get(Object.getPrototypeOf(BooleanNode.prototype), "constructor", this).apply(this, arguments);
	}

	_inherits(BooleanNode, _React$Component3);

	_createClass(BooleanNode, [{
		key: "render",
		value: function render() {
			var node = this.props.node;

			return React.createElement(
				"span",
				{ className: "booleanNode" },
				JSON.stringify(node)
			);
		}
	}]);

	return BooleanNode;
})(React.Component);

var NumberNode = (function (_React$Component4) {
	function NumberNode() {
		_classCallCheck(this, NumberNode);

		_get(Object.getPrototypeOf(NumberNode.prototype), "constructor", this).apply(this, arguments);
	}

	_inherits(NumberNode, _React$Component4);

	_createClass(NumberNode, [{
		key: "render",
		value: function render() {
			var node = this.props.node;

			return React.createElement(
				"span",
				{ className: "numberNode" },
				JSON.stringify(node)
			);
		}
	}]);

	return NumberNode;
})(React.Component);

var ListNode = (function (_React$Component5) {
	function ListNode() {
		_classCallCheck(this, ListNode);

		_get(Object.getPrototypeOf(ListNode.prototype), "constructor", this).apply(this, arguments);
	}

	_inherits(ListNode, _React$Component5);

	_createClass(ListNode, [{
		key: "render",
		value: function render() {
			var _props3 = this.props;
			var node = _props3.node;
			var expanded = _props3.expanded;
			var toggleExpand = _props3.toggleExpand;

			if (expanded) {
				return React.createElement(
					"span",
					{ className: "listNode expanded" },
					React.createElement(
						"span",
						{ className: "clickable", onClick: toggleExpand },
						"["
					),
					React.createElement("br", null),
					React.createElement(
						"span",
						{ className: "indent" },
						array_join(node.map(function (e, i) {
							return React.createElement(Node, { node: e, key: i });
						}), React.createElement(Comma, { br: true }))
					),
					React.createElement("br", null),
					React.createElement(
						"span",
						{ onClick: toggleExpand },
						"]"
					)
				);
			} else {
				return React.createElement(
					"span",
					{ className: "listNode clickable", onClick: toggleExpand },
					"[",
					node.length,
					"]"
				);
			}
		}
	}]);

	return ListNode;
})(React.Component);

var ObjectNode = (function (_React$Component6) {
	function ObjectNode() {
		_classCallCheck(this, ObjectNode);

		_get(Object.getPrototypeOf(ObjectNode.prototype), "constructor", this).apply(this, arguments);
	}

	_inherits(ObjectNode, _React$Component6);

	_createClass(ObjectNode, [{
		key: "render",
		value: function render() {
			var _props4 = this.props;
			var node = _props4.node;
			var expanded = _props4.expanded;
			var toggleExpand = _props4.toggleExpand;

			if (null === node) {
				return React.createElement(
					"span",
					{ className: "nullNode" },
					"null"
				);
			} else if (expanded) {
				return React.createElement(
					"span",
					{ className: "objectNode expanded" },
					React.createElement(
						"span",
						{ className: "clickable", onClick: toggleExpand },
						"{"
					),
					React.createElement("br", null),
					React.createElement(
						"span",
						{ className: "indent" },
						array_join(Object.keys(node).map(function (key) {
							return React.createElement(Node, { node: node[key], label: key, key: key });
						}), React.createElement(Comma, { br: true }))
					),
					React.createElement("br", null),
					React.createElement(
						"span",
						{ onClick: toggleExpand },
						"}"
					)
				);
			} else {
				var keys = Object.keys(node),
				    toolong = false;
				if (keys.length > 4) {
					keys = keys.slice(0, 4);
					toolong = true;
				}
				var contents = array_join(keys.map(function (k) {
					return React.createElement(
						"span",
						{ className: "label" },
						k
					);
				}), React.createElement(Comma, null));
				return React.createElement(
					"span",
					{ className: "objectNode clickable", onClick: toggleExpand },
					"{",
					contents,
					toolong ? React.createElement(Ellipsis, null) : "",
					"}"
				);
			}
		}
	}]);

	return ObjectNode;
})(React.Component);

var Comma = (function (_React$Component7) {
	function Comma() {
		_classCallCheck(this, Comma);

		_get(Object.getPrototypeOf(Comma.prototype), "constructor", this).apply(this, arguments);
	}

	_inherits(Comma, _React$Component7);

	_createClass(Comma, [{
		key: "render",
		value: function render() {
			var br = this.props.br;

			return React.createElement(
				"span",
				{ className: "comma" },
				", ",
				br ? React.createElement("br", null) : ""
			);
		}
	}]);

	return Comma;
})(React.Component);

var Ellipsis = (function (_React$Component8) {
	function Ellipsis() {
		_classCallCheck(this, Ellipsis);

		_get(Object.getPrototypeOf(Ellipsis.prototype), "constructor", this).apply(this, arguments);
	}

	_inherits(Ellipsis, _React$Component8);

	_createClass(Ellipsis, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"span",
				{ className: "ellipsis" },
				"..."
			);
		}
	}]);

	return Ellipsis;
})(React.Component);

var simplething = {
	hello: 42,
	derp: 324,
	wumbo: [1, 2, 3, 4, "hello", {
		blah: 32,
		asdf: [],
		walp: 32,
		strings: "asdfsd"
	}],
	merp: {
		blah: 32,
		asdf: [],
		walp: 32,
		strings: "asdfsd"
	},
	strings: "asdfsd",
	asdoijfo: {
		strings: "asdfsd",
		adfds: {
			asdf: {
				asdfadsf: {},
				merp: 32
			}
		}
	}
}

// React.render(<Node node={simplething} />, document.getElementById('explorer'))
;
