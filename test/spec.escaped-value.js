'use strict';

var escapedValueModule = require('../src/escaped-value');
var escape = escapedValueModule.makeEscapedValue;
var EscapedValue = escapedValueModule.EscapedValue;

describe('escaped-value', function() {

  it('returns an instance of EscapedValue', function () {
    var escapedValue = escape('some-value');
    expect(escapedValue).to.be.an.instanceOf(EscapedValue);
  });

  it('can get a value that was wrapped within EscapedValue', function() {
    var escapedValue = escape('some-value');
    var percept = escapedValue.get();
    expect(percept).to.equal('some-value');
  });

});
