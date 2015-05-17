# jstruct [![Build Status](https://travis-ci.org/sebinsua/jstruct.png)](https://travis-ci.org/sebinsua/jstruct) [![npm version](https://badge.fury.io/js/jstruct.svg)](https://npmjs.org/package/jstruct)
> :bulb: Quick and easy JSON transformations.

Jstruct allows quick and easy JSON transformations through the use of a declarative JSON DSL.

```javascript
import j, { sel } from 'jstruct';
import { curry } from 'ramda';

// ... getAccount() definition

const prefix = curry((pre, str) => pre + str);
const format = j({
  id: 'account/id',
  name: 'account/name',
  hasAddress: sel.isNotEmpty('account/address'),
  lastPaymentAmount: sel('account/paymentHistory[0]/amount', prefix('£'))
});

getAccount().then(format);
// ->
// {
//   id: 5,
//   name: 'Seb',
//   hasAddress: true,
//   lastPaymentAmount: '£50'
// }
```

## Why?

Converting between different data representations in JavaScript is easier than many languages because of the concise and declarative JSON. However, currently [both imperative and functional approaches create unnecessarily verbose code](https://github.com/sebinsua/jstruct/wiki/Premise).

## Usage

#### `j(definition, object)`

This accepts two arguments: `definition`, the definition of the object that should be returned from the transformation, and `object` the data that should be transformed.

A definition is a deep key-value object in which the values are all selector strings/instances - the former being converted into the latter on execution.

This function is [curried by default](http://en.wikipedia.org/wiki/Currying). If you do not supply all of the arguments required for computation it will return a function with the arguments already supplied bound to it.

This makes it very simple to create formatting functions that expect objects and return transformations of the objects passed in.

e.g.

```javascript
[{ key: 1 }, { key: 2 }, { missesKey: 3 }].map(j({ keyExists: j.exists('key') }));
// -> [ { keyExists: true }, { keyExists: true }, { keyExists: false } ]
```

#### `j.sel(selector[, transformationFn])`

This creates an instance of `Selector` from a string. It may optionally have a transformation function passed into it with the following method signature `function (valueToBeTransformed) { return transformedValue; }`.

Examples of valid selectors are:

```
a-selector
a/deeply/nested/selector
a/deeply/nested/array-item[5]
array[0][1][2]
```

## Installation
```shell
npm install [--save] jstruct;
```
