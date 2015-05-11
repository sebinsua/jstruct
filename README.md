# jstruct [![Build Status](https://travis-ci.org/sebinsua/jstruct.png)](https://travis-ci.org/sebinsua/jstruct) [![npm version](https://badge.fury.io/js/jstruct.svg)](https://npmjs.org/package/jstruct)
> :bulb: Quick and easy JSON transformations.

Jstruct allows quick and easy JSON transformations through the use of a declarative JSON DSL.

```javascript
import j from 'jstruct';

getAccount().then(j({
  id: 'account/id',
  name: 'account/name',
  lastPaymentAmount: 'account/paymentHistory[0]/amount',
  hasAddress: j.sel.exists('account/address')
}));
// ->
// {
//   id: 7,
//   name: 'bob',
//   lastPaymentAmount: '£10',
//   hasAddress: true
// }

```

## Why?

Converting between different data types in JavaScript is easier than many languages because of the concise and declarative JSON. However, currently [both imperative and functional approaches create unnecessarily verbose code](https://github.com/sebinsua/jstruct/wiki/Premise).

## Installation

```shell
npm install [--save] jstruct;
```

## Usage

*Coming soon.*
