'use strict';

var R = require('ramda');

var exists = R.pipe(R.isNil, R.not);

var first = R.head;

var isNotEmpty = R.pipe(R.keys, R.isEmpty, R.not);

var defaultsTo = function defaultsTo(defaultValue) {
  return R.ifElse(exists, R.identity, R.always(defaultValue));
};

module.exports.exists = exists;
module.exports.first = first;
module.exports.isNotEmpty = isNotEmpty;
module.exports.defaultsTo = defaultsTo;
