'use strict';

var look = require('ramda-debug');

var selectorModule = rewire('../src/selector');
var sel = selectorModule.makeSelector;

var oldR = selectorModule.__get__('R');
var newR = look.wrap(oldR);
selectorModule.__set__('R', newR);

describe('selector', function() {

  var object, array;
  beforeEach(function() {
    object = {
      specificObjectKey: 7,
      other: 'definitely not this',
      deeply: {
        nested: {
          key: 'You found me.'
        }
      }
    };

    array = [
      5,
      6,
      7,
      8,
      11, [12]
    ];
  });

  xit('returns an instance of Selector', function () {

  });

  it('can select the value at a specific object key', function() {
    var selector = sel('specificObjectKey');
    var percept = selector.get(object);
    expect(percept).to.equal(7);
  });

  it('can select the value at a specific array key', function() {
    var selector = sel('[4]');
    var percept = selector.get(array);

    expect(percept).to.equal(11);
  });

  it('can select the value at a deeply nested array key', function() {
    var selector = sel('[5][0]');
    var percept = selector.get(array);

    expect(percept).to.equal(12);
  });

  it('can select the value at a specific key when deeply nested', function() {
    var selector = sel('deeply/nested/key');
    var percept = selector.get(object);

    expect(percept).to.equal('You found me.');
  });

  it('will receive null if I try to get() with a valid key on some data which does not contain this', function() {
    var selector = sel('a/non/existent/key');
    var percept = selector.get(object);

    expect(percept).to.equal(null);
  });

  it('will receive an error if I try to create a Selector with an invalid path', function() {
    var invalidPaths = ['', null, undefined, -12, 45.5];

    invalidPaths.forEach(function(path) {
      expect(function() {
        var selector = sel(path);
      }).to.throw(Error, 'Invalid path specified');
    });
  });

  xit('should execute the transformation function with the selectors value when it is passed in as the second argument', function () {

  });

});
