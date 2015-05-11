'use strict';
/* eslint no-unused-vars: 0 */

var transformers = require('../src/transformers');

// TODO: Test the behaviour of each of the transformers.

describe('tranformers', function() {

  describe('#exists', function() {

    it('should exist', function() {
      expect(transformers.exist).to.be.defined;
    });

  });

  describe('#first', function() {

    it('should exist', function() {
      expect(transformers.first).to.be.defined;
    });

  });

  describe('#isNotEmpty', function() {

    it('should exist', function() {
      expect(transformers.isNotEmpty).to.be.defined;
    });

  });

  describe('#defaultsTo', function() {

    it('should exist', function() {
      expect(transformers.defaultsTo).to.be.defined;
    });

  });

});
