#!/usr/bin/env babel-node

import j, { sel, escape } from '..';
import { curry } from 'ramda';

function getAccount() {
  return new Promise((resolve, reject) => {
    resolve({
      account: {
        id: 5,
        name: 'Seb',
        address: {
          city: 'London',
          country: 'United Kingdom'
        },
        paymentHistory: [
          { amount: 50 },
          { amount: 45 }
        ]
      }
    });
  });
}

const prefix = curry((pre, str) => pre + str);
const format = j({
  id: 'account/id',
  name: 'account/name',
  type: escape('human'),
  hasAddress: sel.isNotEmpty('account/address'),
  lastPaymentAmount: sel('account/paymentHistory[0]/amount', prefix('£'))
});

getAccount().then(format).then((resp) => { console.log(resp); });
