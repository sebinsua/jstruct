'use strict';

var j = require('./jstruct');

var makeSelector = require('./selector').makeSelector;

var selectors = require('./selectors');
var transformers = require('./transformers');

var sel = makeSelector;

for (var selectorKey in selectors) {
  sel[selectorKey] = selectors[selectorKey];
}

j.sel = sel;
j.trans = transformers;

module.exports = j;
