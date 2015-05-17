'use strict';

var transformers = require('../src/transformers'),
    selectors = require('../src/selectors');

describe('selectors', function() {

  describe('should contain the following selectors', function() {

    Object.keys(transformers).forEach(function(transformerKey) {

      it('#' + transformerKey, function() {
        expect(selectors[transformerKey]).to.exist;
      });

    });

  });

  describe('#defaultsTo', function () {

    xit('passes its arguments into its transformer', function () {

    });

  });

});
