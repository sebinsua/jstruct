#!/usr/bin/env babel-node

import j, { sel, escape } from '..';

function formatWithArray() {
  const data = [
    { key: 1 },
    { key: 2 },
    { missesKey: 3 }
  ];

  const format = j([sel.exists('key'), sel.exists('missesKey')]);

  var response = data.map(format);
  return response;
}

function dataWithArray() {
  const data = [
    { key: 1 },
    { key: 2 },
    { missesKey: 3 }
  ];

  const format = j({
    truth: sel.exists('[0]key'),
    dare: sel.exists('[2]key')
  });

  var response = format(data);
  return response;
}

function bothWithArray() {
  const data = [
    [ 10, 11, 12 ],
    [ 56, 74, 92 ],
    [ 2, 3, 8 ]
  ];

  const format = j([
    [ sel('[2]'), sel('[1]'), sel('[0]') ], [ sel('[1]'), sel('[0]'), sel('[2]') ]
  ]);

  var response = data.map(format);
  return response;
}

function formatWithValue() {
  const data = [
    { key: 1 },
    { key: 2 },
    { missesKey: 3 }
  ];

  const format = j(sel('key'));

  var response = data.map(format);
  return response;
}

function dataWithValue() {
  const data = 1;

  const format = j({
    'value': sel('$v')
  });

  var response = format(data);
  return response;
}

function bothWithValue() {
  const data = 1;

  const format = j(sel('$v'));

  var response = format(data);
  return response;
}

console.log(formatWithArray());
console.log(dataWithArray());
console.log(bothWithArray());

console.log(formatWithValue());
console.log(dataWithValue());
console.log(bothWithValue());
