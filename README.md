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

*Coming soon.*

## Installation
```shell
npm install [--save] jstruct;
```
