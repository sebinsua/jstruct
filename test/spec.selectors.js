'use strict';
/* eslint no-unused-vars: 0 */

var transformers = require('../src/transformers'),
  selectors = require('../src/selectors');

// TODO: Test that the defaultsTo selector passes arguments into
//       its tranformer.

describe('selectors', function() {

  describe('should contain the following selectors', function() {

    Object.keys(transformers).forEach(function(transformerKey) {

      it('#' + transformerKey, function() {
        expect(selectors[transformerKey]).to.exist;
      });

    });

  });

});
