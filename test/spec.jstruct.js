'use strict';

var look = require('ramda-debug');

var j = rewire('../src/jstruct');
var sel = require('../src/selector').makeSelector;

var oldR = j.__get__('R');
var newR = look.wrap(oldR);
j.__set__('R', newR);

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

  it('should be a function', function () {
    expect(j).to.be.a.function;
  });

  it('should return a formatting function if only the first argument is passed in', function () {
    var format = j({ def: 'some-selector' });
    expect(format).to.be.a.function;
  });

  it('should return null if the definition is null', function () {
    var output = j(null, {});
    expect(output).to.be.null;
  });

  it('should return null if the object is null', function () {
    var output = j(null, {});
    expect(output).to.be.null;
  });

  it('is able to name a key of an object', function () {
    var format = {
      namedKey: 'numberOfFriends'
    };
    var expectedOutput = {
      namedKey: 5
    };

    var output = j(format, data);

    expect(output).to.eql(expectedOutput);
  });

  it('is able to name a key of an array', function () {
    var format = {
      insideArray: 'fruit[1]'
    };
    var expectedOutput = {
      insideArray: 'orange'
    };

    var output = j(format, data);

    expect(output).to.eql(expectedOutput);
  });

  it('is able to name a deeply nested key', function () {
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

  it('can perform a transformation with an array definition', function () {
    function formatWithArray() {
      var d = [
        { key: 1 },
        { key: 2 },
        { missesKey: 3 }
      ];

      var format = j([sel.exists('key'), sel.exists('missesKey')]);

      var response = d.map(format);
      return response;
    }

    expect(formatWithArray()).to.eql([
      [true, false],
      [true, false],
      [false, true]
    ]);
  });

  it('can perform a transformation with an array as the data', function () {
    function dataWithArray() {
      var d = [
        { key: 1 },
        { key: 2 },
        { missesKey: 3 }
      ];

      var format = j({
        truth: sel.exists('[0]key'),
        dare: sel.exists('[2]key')
      });

      var response = format(d);
      return response;
    }

    expect(dataWithArray()).to.eql({
      truth: true,
      dare: false
    });
  });

  it('can perform a transformation with both an array definition and an array as the data', function () {
    function bothWithArray() {
      var d = [
        [ 10, 11, 12 ],
        [ 56, 74, 92 ],
        [ 2, 3, 8 ]
      ];

      var format = j([
        [ sel('[2]'), sel('[1]'), sel('[0]') ], [ sel('[1]'), sel('[0]'), sel('[2]') ]
      ]);

      var response = d.map(format);
      return response;
    }

    expect(bothWithArray()).to.eql([
      [ [12, 11, 10], [11, 10, 12] ],
      [ [92, 74, 56], [74, 56, 92] ],
      [ [8, 3, 2], [3, 2, 8] ]
    ]);
  });

  it('can perform a transformation with a single value', function () {
    function formatWithValue() {
      var d = [
        { key: 1 },
        { key: 2 },
        { missesKey: 3 }
      ];

      var format = j(sel('key'));

      var response = d.map(format);
      return response;
    }

    expect(formatWithValue()).to.eql([1, 2, null]);
  });

  it('can perform a transformation with a single value as the data', function () {
    function dataWithValue() {
      var d = 1;

      var format = j({
        'value': sel('$v')
      });

      var response = format(d);
      return response;
    }

    expect(dataWithValue()).to.eql({ 'value': 1 });
  });

  it('can perform a transformation with both a single value as the definition and a single value as the data', function () {
    function bothWithValue() {
      var d = 1;

      var format = j(sel('$v'));

      var response = format(d);
      return response;
    }

    expect(bothWithValue()).to.equal(1);
  });

});
