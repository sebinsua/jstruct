'use strict';

var look = require('ramda-debug');

var transformers = rewire('../src/transformers');

var oldR = transformers.__get__('R');
var newR = look.wrap(oldR);
transformers.__set__('R', newR);

describe('tranformers', function() {

  describe('#exists', function() {

    it('should exist', function() {
      expect(transformers.exist).to.be.defined;
    });

    xit('should return true if not nil', function () {

    });

    xit('should return false if nil', function () {

    });

  });

  describe('#first', function() {

    it('should exist', function() {
      expect(transformers.first).to.be.defined;
    });

    xit('should return the first item of an array', function () {

    });

    xit('should return null if there is no first item in an array', function () {

    });

  });

  describe('#isNotEmpty', function() {

    it('should exist', function() {
      expect(transformers.isNotEmpty).to.be.defined;
    });

    xit('should return true if an object is not empty', function () {

    });

    xit('should return false if an object is empty', function () {

    });

  });

  describe('#defaultsTo', function() {

    it('should exist', function() {
      expect(transformers.defaultsTo).to.be.defined;
    });

    xit('should return a function if only one argument is passed in', function () {

    });

    xit('should return the default that is passed in if the second argument is non-truthy', function () {

    });

    xit('should return the second argument if it truthy', function () {

    });

  });

});
