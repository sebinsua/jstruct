'use strict';
/* eslint no-unused-vars: 0 */

var j = require('..');

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

  it('is able to name a key of an object.', function() {
    var format = {
      namedKey: 'numberOfFriends'
    };
    var expectedOutput = {
      namedKey: 5
    };

    var output = j(format, data);

    expect(output).to.eql(expectedOutput);
  });

  it('is able to name a key of an array.', function() {
    var format = {
      insideArray: 'fruit[1]'
    };
    var expectedOutput = {
      insideArray: 'orange'
    };

    var output = j(format, data);

    expect(output).to.eql(expectedOutput);
  });

  it('is able to name a deeply nested key.', function() {
    var format = {
      deeplyNestedKey: 'surroundings/treesNearby'
    };
    var expectedOutput = {
      deeplyNestedKey: 11
    };

    var output = j(format, data);

    expect(output).to.eql(expectedOutput);
  });

});

describe('jstruct-class', function() {

  // TODO: Test j on its own or with a single value passed in is a function.

  describe('throws errors on bad formatting or object data', function () {

    var invalidFormats = [-5, 8.9, 'some text'];
    var invalidDatas = [-5, 8.9, 'some text'];

    invalidFormats.forEach(function (format) {

      it('format ' + format + ' should throw', function () {
        expect(function() {
          var map = j(format, null);
        }).to.throw(Error, 'Invalid format specified');
      });

    });

    invalidDatas.forEach(function (data) {

      it('data ' + data + ' should throw', function () {
        expect(function() {
          var map = j({}, data);
        }).to.throw(Error, 'Invalid data specified');
      });

    });

  });

  it('is able to pass in data to the JStruct class without causing it to output anything.', function() {
    var output = j({
      newKey: 'someData'
    }, {
      someData: 5
    });

    expect(output).to.not.equal({
      newKey: 5
    });
  });

  it('is able to pass in valid data to the JStruct class and then to output it by executing value().', function() {
    var data = {
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
      friends: 5,
      trees: 11,
      place: 'paris'
    };

    var output = j({
      friends: 'numberOfFriends',
      trees: 'surroundings/treesNearby',
      place: 'surroundings/location'
    }, data);

    expect(output).to.eql(expectedOutput);
  });

  it('is able to pass in invalid data to the JStruct class and to get a response containing undefineds if I execute value().', function() {
    var data = {
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
    }, data);

    expect(output).to.eql(expectedOutput);
  });

});

describe('jstruct-concise', function() {

  it('can perform a transformation of an object into another object with a particular structure.', function() {
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
    var data = {
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

    var output = j(format, data);

    expect(output).to.eql(expectedOutput);
  });

  it('will receive an error if the format supplied is invalid.', function() {
    var format = 678;
    var data = {
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

    expect(function() {
      var output = j(format, data);
    }).to.throw(Error, 'Invalid format specified');
  });

});
