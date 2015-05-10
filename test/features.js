
describe('Query', function () {
  var object, array;

  beforeEach(function () {
    object = {
      specificObjectKey: 7,
      other: 'definitely not this',
      deeply: {
        nested: {
          key: "You found me! My saviour!"
        }
      }
    };

    array = [
      5,
      6,
      7,
      8,
      11,
      [ 12 ]
    ];
  });

  it("can select the value at a specific object key.", function () {
    var eyeball = new BasicJsonPath("specificObjectKey");
    var percept = eyeball.perceive(object);

    expect(percept).toBe(7);
  });

  it("can select the value at a specific array key.", function () {
    var eyeball = new BasicJsonPath("[4]");
    var percept = eyeball.perceive(array);

    expect(percept).toBe(11);
  });

  it("can select the value at a deeply nested array key.", function () {
    var eyeball = new BasicJsonPath("[5][0]");
    var percept = eyeball.perceive(array);

    expect(percept).toBe(12);
  });

  it("can select the value at a specific key when deeply nested.", function () {
    var eyeball = new BasicJsonPath("deeply.nested.key");
    var percept = eyeball.perceive(object);

    expect(percept).toBe("You found me! My saviour!");
  });

  it("will receieve undefined if I try to perceive() with a valid key on some data which does not contain this.", function () {
    var eyeball = new BasicJsonPath("a.non.existent.key");
    var percept = eyeball.perceive(object);

    expect(percept).toBe(undefined);
  });

  it("will receive an error if I try to create a JsonPointer with an invalid path.", function () {
    var invalidPaths = ["", null, undefined, -12, 45.5];

    invalidPaths.forEach(function (path) {
      expect(function () { var eyeball = new BasicJsonPath(path); }).toThrow(new Error("Invalid path specified"));  
    });
  });

});

describe('Restructure', function () {

  var data; 

  beforeEach(function () {
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

  it("is able to name a key of an object.", function () {
    var format = {
      namedKey: 'numberOfFriends'
    }, expectedOutput = {
      namedKey: 5
    };

    var restructure = new Jstruct(format, data),
        output = restructure.value();

    expect(output).toEqual(expectedOutput);
  });

  it("is able to name a key of an array.", function () {
    var format = {
      insideArray: 'fruit[1]'
    }, expectedOutput = {
      insideArray: 'orange'
    };

    var restructure = new Jstruct(format, data),
        output = restructure.value();

    expect(output).toEqual(expectedOutput);
  });

  it("is able to name a deeply nested key.", function () {
    var format = {
      deeplyNestedKey: 'surroundings.treesNearby'
    }, expectedOutput = {
      deeplyNestedKey: 11
    };

    var restructure = new Jstruct(format, data),
        output = restructure.value();

    expect(output).toEqual(expectedOutput);
  });

});

describe('Class Interface', function () {

  it("is able to construct a JStruct object with a valid representation.", function () {
    var restructure = new Jstruct({}, {});

    expect(restructure instanceof Jstruct).toBeTruthy();
  });

  it("will receive an error if one of the arguments to the JStruct constructor is bad.", function () {
    var invalidFormats = [-5, 8.9, 'some text'];
    var invalidDatums = [-5, 8.9, 'some text'];

    invalidFormats.forEach(function (format) {
      expect(function () { var restructure = new Jstruct(format); }).toThrow(new Error("Invalid format specified"));  
    });

    invalidDatums.forEach(function (data) {
      expect(function () { var restructure = new Jstruct(null, data); }).toThrow(new Error("Invalid data specified"));  
    });
  });

  it("is able to pass in data to the JStruct class without causing it to output anything.", function () {
    var restructure = new Jstruct({
      newKey: 'someData'
    });
    var output = restructure.in({
      someData: 5
    });

    expect(output).toNotEqual({
      newKey: 5
    });
  });

  it("is able to pass in valid data to the JStruct class and then to output it by executing value().", function () {
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

    var restructure = new Jstruct({
      friends: 'numberOfFriends',
      trees: 'surroundings.treesNearby',
      place: 'surroundings.location'
    });
    var output = restructure.in(data).value();

    expect(output).toEqual(expectedOutput);
  });

  it("is able to pass in invalid data to the JStruct class and to get a response with undefined's if I execute value().", function () {
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
      friends: undefined,
      trees: undefined,
      place: undefined
    };

    var restructure = new Jstruct({
      friends: 'numberOfFriends',
      trees: 'surroundings.treesNearby',
      place: 'surroundings.location'
    });
    var output = restructure.in(data).value();

    expect(output).toEqual(expectedOutput);    
  });

  // xit("is able to forget to pass in data and then to cause an error if I execute value().", function () {});
  // xit("is able to pass in some global functions which can be used in keys (as well as values).", function () {});

});

describe('Concise Interface', function () {

  it("can perform a transformation of an object into another object with a particular structure.", function () {
    var format = {
      fruitPicked: 'fruit[0]',
      feeling: {
        dueTo: {
          location: 'surroundings.location'
        }
      },
      quantities: {
        friends: 'numberOfFriends',
        treesNearby: 'surroundings.treesNearby'
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
        friends : 5,
        treesNearby : 11
      }
    };

    var output = jstruct(data, format);

    expect(output).toEqual(expectedOutput);
  });

  it("will receive an error if the format supplied is invalid.", function () {
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

    expect(function () {
      var output = jstruct(data, format);
    }).toThrow(new Error("Invalid format specified"));
  });

});

// 
// LATER:
// 
// Complex Data:
// 
// I want to be able to namespace some data.
// I want to be able to pass in 1 or more datums.
// I want to be able to setup some constraints between datums that will allow them to be munged together.
// I want to be able to set defaults.
// 
// Complex Representations:
// 
// I want to be able to escape a value with JStruct.value().
// I want to be able to pass in a JStruct.path() which can take multiple arguments.
// 
// Complex Expressions which contain coupling:
// 
// I want to be able to group by a path.
// I want to be able to execute functions which depend on multiple paths. E.g. b:filter(a.name===b.name) - possible solution: this is the context of the json structure, so a function can access paths from this.
// 
// Value function extensions:
// 
// I want to be able to filter an array.
// I want to be able to filter an object.
// I want to be able to run a function against a value.
// I want to be able to slice an array.
// I want to be able to map/reduce an array/object.
// 
