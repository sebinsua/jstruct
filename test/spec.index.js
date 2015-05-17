'use strict';

var j = require('../src/index');

describe('module', function () {

  it('should be a function', function () {
    expect(j).to.be.a.function;
  });

  describe('should contain the following properties', function() {

    Object.keys(j).forEach(function (propName) {

      it(propName, function() {
        expect(j[propName]).to.exist;
      });

    });

  });

});
