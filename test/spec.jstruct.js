'use strict';
/* eslint no-unused-vars: 0 */

var j = require('..');

// TODO: Test j on its own or with a single value passed in is a function.

describe('jstruct', function() {

  var data;

  beforeEach(function() {
    data = {
      numberOfFriends: 5,
      surroundings: {
        location: 'paris',
        treesNearby: 11
      },
      fruit: [
        'apple',
        'orange',
        'lemon'
      ]
    };
  });

  describe('throws errors on bad formatting or object data', function() {

    var invalidFormats = [-5, 8.9, 'some text'];
    var invalidDatas = [-5, 8.9, 'some text'];

    invalidFormats.forEach(function(f) {

      it('format ' + f + ' should throw', function() {
        expect(function() {
          var map = j(f, null);
        }).to.throw(Error, 'Invalid format specified');
      });

    });

    invalidDatas.forEach(function(d) {

      it('data ' + d + ' should throw', function() {
        expect(function() {
          var map = j({}, d);
        }).to.throw(Error, 'Invalid data specified');
      });

    });

  });

  it('is able to name a key of an object', function() {
    var format = {
      namedKey: 'numberOfFriends'
    };
    var expectedOutput = {
      namedKey: 5
    };

    var output = j(format, data);

    expect(output).to.eql(expectedOutput);
  });

  it('is able to name a key of an array', function() {
    var format = {
      insideArray: 'fruit[1]'
    };
    var expectedOutput = {
      insideArray: 'orange'
    };

    var output = j(format, data);

    expect(output).to.eql(expectedOutput);
  });

  it('is able to name a deeply nested key', function() {
    var format = {
      deeplyNestedKey: 'surroundings/treesNearby'
    };
    var expectedOutput = {
      deeplyNestedKey: 11
    };

    var output = j(format, data);

    expect(output).to.eql(expectedOutput);
  });

  it('is able to pass in invalid data and to get null where it cannot find the selectors', function() {
    var d = {
      a: 5,
      b: {
        c: 'paris',
        d: 11
      },
      e: [
        'apple',
        'orange',
        'lemon'
      ]
    };
    var expectedOutput = {
      friends: null,
      trees: null,
      place: null
    };

    var output = j({
      friends: 'numberOfFriends',
      trees: 'surroundings/treesNearby',
      place: 'surroundings/location'
    }, d);

    expect(output).to.eql(expectedOutput);
  });

  it('can perform a transformation of an object into another object with a particular structure', function() {
    var format = {
      fruitPicked: 'fruit[0]',
      feeling: {
        dueTo: {
          location: 'surroundings/location'
        }
      },
      quantities: {
        friends: 'numberOfFriends',
        treesNearby: 'surroundings/treesNearby'
      }
    };
    var d = {
      numberOfFriends: 5,
      surroundings: {
        location: 'paris',
        treesNearby: 11
      },
      fruit: [
        'apple',
        'orange',
        'lemon'
      ]
    };
    var expectedOutput = {
      fruitPicked: 'apple',
      feeling: {
        dueTo: {
          location: 'paris'
        }
      },
      quantities: {
        friends: 5,
        treesNearby: 11
      }
    };

    var output = j(format, d);

    expect(output).to.eql(expectedOutput);
  });

});
