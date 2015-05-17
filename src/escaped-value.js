'use strict';

function EscapedValue (value) {
  this.value = value;
}

EscapedValue.prototype.get = function () {
  return this.value;
};

// The selector argument may be a string or an array of strings.
function makeEscapedValue(value) {
  return new EscapedValue(value);
}

module.exports.makeEscapedValue = makeEscapedValue;
module.exports.EscapedValue = EscapedValue;
