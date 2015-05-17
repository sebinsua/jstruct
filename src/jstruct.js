'use strict';
/* eslint no-underscore-dangle: 0 */

var R = require('ramda');

var makeSelector = require('./selector').makeSelector;

var Selector = require('./selector').Selector;
var EscapedValue = require('./escaped-value').EscapedValue;

var isEscapedValue = R.is(EscapedValue);
var isSelector = R.is(Selector);
var isObjectLiteral = function isObject(v) {
  return R.is(Object, v) && v.constructor === Object;
};

var get = R.curry(function get(selector, obj) {
  var isNotAlreadyWrapped = !isSelector(selector) && !isEscapedValue(selector);
  if (isNotAlreadyWrapped) {
    selector = makeSelector(selector);
  }

  return selector.get(obj);
});
get.displayName = 'get';

var transform = R.curry(function _transform(fn, obj) {
  return R.cond(
    [R.isArrayLike, R.map(transform(fn))],
    [isObjectLiteral, R.mapObj(transform(fn))],
    [R.T, fn]
  )(obj);
});
transform.displayName = 'transform';

var deepPick = R.curry(function deepPick(def, obj) {
  var getValue = get(R.__, obj);

  var newObj = transform(getValue, def);

  return newObj;
});

// Takes in an object of selectors.
// Use a selector on its own if you wish take in a
// single string or array of strings.
var j = R.curry(function j(def, obj) {
  if (!isObjectLiteral(def)) {
    throw new Error('Invalid format specified');
  }
  if (!isObjectLiteral(obj)) {
    throw new Error('Invalid data specified');
  }

  var keys = R.keys(def) || [];

  var picker = keys.length ? deepPick(def) : R.identity;

  return picker(obj);
});
j.displayName = 'jstruct';

module.exports = j;
module.exports.Selector = Selector;
