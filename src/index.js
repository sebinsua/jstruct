'use strict';

var j = require('./jstruct');

var makeEscapedValue = require('./escaped-value').makeEscapedValue;
var makeSelector = require('./selector').makeSelector;

var selectors = require('./selectors');
var transformers = require('./transformers');

var sel = makeSelector;
var escape = makeEscapedValue;

for (var selectorKey in selectors) {
  sel[selectorKey] = selectors[selectorKey];
}

j.escape = escape;
j.sel = sel;
j.trans = transformers;

module.exports = j;
