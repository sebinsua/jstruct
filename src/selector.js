'use strict';

var R = require('ramda');

var isArray = R.is(Array);
var isNotNil = R.pipe(R.isNil, R.not);

var DEFAULT_VALUE = null;

function selectorToPath(selector, separator) {
    selector = selector.trim() || '';
    separator = separator || '/';

    // We need to handle square bracket array access.
    selector = R.replace(/\[(\w*)\]/g, separator + '$1' + separator, selector);

    return selector.split(separator).filter(R.identity);
}

function Selector (selector, transformFn) {
  if (isArray(selector)) {
    var selectorsToPaths = R.map(selectorToPath);
    this.paths = selectorsToPaths(selector);
  } else {
    this.path = selectorToPath(selector);
  }

  this.transformation = transformFn || R.identity;
}

Selector.prototype.get = function (obj) {
  var getValue = R.bind(this.getValue, this),
      transformValue = R.bind(this.transformValue, this);

  var getAndTransform = R.pipe(getValue, transformValue);

  // We cannot curry without losing `this` so this is our best option.
  return obj ? getAndTransform(obj) : getAndTransform;
};

Selector.prototype.getValue = function (obj) {
  var getAtPath = function getAtPath(path, o) {
    // This is a temporary special case that
    // eventually will require a rewrite of `R.path`.
    if (path && path[0] === '$v') {
      return o;
    }
    return R.path(path, o);
  };

  var value = DEFAULT_VALUE;
  if (this.paths) {
    value = R.pipe(R.map(function (path) {
      return getAtPath(path, obj);
    }), R.filter(isNotNil))(this.paths);
  } else {
    value = getAtPath(this.path, obj);
  }

  return value;
};

Selector.prototype.transformValue = function (value) {
  var transformation = this.transformation;

  value = transformation(value);

  return typeof value !== 'undefined' ? value : DEFAULT_VALUE;
};

// The selector argument may be a string or an array of strings.
function makeSelector(selector, transformFn) {
  if (!selector || !selector.length) {
    throw new Error('Invalid path specified: ' + selector);
  }

  return new Selector(selector, transformFn);
}

module.exports.makeSelector = makeSelector;
module.exports.Selector = Selector;
