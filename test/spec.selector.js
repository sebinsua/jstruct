'use strict';
/* eslint no-unused-vars: 0 */

var j = require('..');

// TODO: Test passing in a def with a single exists selector.
// TODO: Test to see if .sel returns a Selector.
// TODO: Test to see if a transform can be passed into the .sel.
// TODO: Test defaultsTo, first and the isNotEmpty selectors.

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

  it('can select the value at a specific object key.', function() {
    var eyeball = j.sel('specificObjectKey');
    var percept = eyeball.get(object);

    expect(percept).to.equal(7);
  });

  it('can select the value at a specific array key.', function() {
    var eyeball = j.sel('[4]');
    var percept = eyeball.get(array);

    expect(percept).to.equal(11);
  });

  it('can select the value at a deeply nested array key.', function() {
    var eyeball = j.sel('[5][0]');
    var percept = eyeball.get(array);

    expect(percept).to.equal(12);
  });

  it('can select the value at a specific key when deeply nested.', function() {
    var eyeball = j.sel('deeply/nested/key');
    var percept = eyeball.get(object);

    expect(percept).to.equal('You found me.');
  });

  it('will receieve undefined if I try to perceive() with a valid key on some data which does not contain this.', function() {
    var eyeball = j.sel('a.non.existent.key');
    var percept = eyeball.get(object);

    expect(percept).to.equal(null);
  });

  it('will receive an error if I try to create a JsonPointer with an invalid path.', function() {
    var invalidPaths = ['', null, undefined, -12, 45.5];

    invalidPaths.forEach(function(path) {
      expect(function() {
        var eyeball = j.sel(path);
      }).to.throw(Error, 'Invalid path specified');
    });
  });

});
