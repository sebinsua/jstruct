'use strict';
/* eslint no-underscore-dangle: 0 */

var R = require('ramda');

var makeSelector = require('./selector').makeSelector;
var makeEscapedValue = require('./escaped-value').makeEscapedValue;

var isString = R.is(String);
var isNumber = R.is(Number);
var isObjectLiteral = function isObject(v) {
  return R.is(Object, v) && v.constructor === Object;
};
var isNotObjectOrArray = function isNotObjectOrArray(v) {
  return !isObjectLiteral(v) && !R.isArrayLike(v);
};

var get = R.curry(function get(selector, obj) {
  if (isString(selector)) {
    selector = makeSelector(selector);
  } else if (isNumber(selector)) {
    selector = makeEscapedValue(selector);
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
  if (def === null || obj === null) {
    return null;
  }

  var picker;
  if (isNotObjectOrArray(def)) {
    picker = get(def);
  } else {
    var keys = R.keys(def) || [];
    picker = keys.length ? deepPick(def) : R.identity;
  }
  return picker(obj);
});
j.displayName = 'jstruct';

module.exports = j;
