'use strict';

var R = require('ramda');

var makeSelector = require('./selector').makeSelector;

var transformers = require('./transformers');

module.exports = R.mapObj(function (transformer) {
  return function (selector/*, ... */) {
    var otherArguments = R.tail(arguments);
    var t = otherArguments.length ? transformer.apply(transformers, otherArguments) : transformer;
    return makeSelector(selector, t);
  };
}, transformers);
