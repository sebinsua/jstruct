# jstruct [![Build Status](https://travis-ci.org/sebinsua/jstruct.png)](https://travis-ci.org/sebinsua/jstruct)
> :bulb: Quick and easy JSON transformations.

Jstruct allows quick and easy JSON transformations through the use of a declarative JSON DSL.

```javascript
import j from 'jstruct';

getAccount().then(j({
  id: 'account/id',
  name: 'account/name',
  lastPaymentAmount: 'account/paymentHistory[0]/amount',  
}));
// ->
// {
//   id: 7,
//   name: 'bob',
//   lastPaymentAmount: '£10'
// }

```

Why?
----

Converting between different data types in JavaScript is easier than many languages because of the concise and declarative JSON. However, currently both imperative and functional approaches create very verbose code.

For example, given some data such as:

```json
{
  "person": {
    "id": 7,
    "name": "bob",
    "tasks": [
      { "id": 11 },
      { "id": 23 },
      { "id": 99, "optional": [ "a", "b", "c" ] }
    ],
    "interests": [
      { "type": "sport", "name": "football" },
      { "type": "sport", "name": "rugby" },
      { "type": "sport", "name": "swimming" },
      { "type": "entertainment", "name": "tv" }
    ],
    "paymentHistory": [
      { "date": "today", "amount": "£10" },
      { "date": "yesterday", "amount": "£20" },
      { "date": "last week", "amount": "£30" }
    ]
  }
}
```

And desiring data in this format:

```json
{
  "id": 7,
  "name": "bob",
  "lastPaymentAmount": "£10",
  "taskIds": [11, 23, 99],
  "taskIdsWithOptionalData": [99],
  "activities": {
    "sport": ["football", "rugby", "swimming"],
    "entertainment": ["tv"]
  }
}
```

You might write code like this:

```javascript
var newData = {
  id: data.person.id,
  name: data.person.name,
  lastPaymentAmount: data.person.paymentHistory[0].amount,
  taskIds: [],
  taskIdsWithOptionalData: [],
  activities: {}
};
for (var i = 0; i < data.person.tasks.length; i++) {
  newData.taskIds.push(data.person.tasks[i].id);
  if (data.person.tasks[i].optional) {
    newData.taskIdsWithOptionalData.push(data.person.tasks[i].id);
  }
}
for (var it = 0; it < data.person.interests.length; it++) {
  if (newData.activities[data.person.interests[it].type]) {
    newData.activities[data.person.interests[it].type].push(data.person.interests[it].name);
  } else {
    newData.activities[data.person.interests[it].type] = [ data.person.interests[it].name ];
  }
}
```

Or this:

```javascript
var newData = {
  id: data.person.id,
  name: data.person.name,
  lastPaymentAmount: data.person.paymentHistory[0].amount,
  taskIds: _.pluck(data.person.tasks, 'id'),
  taskIdsWithOptionalData: _.chain(data.person.tasks).filter(function (t) { return t.optional; }).pluck('id').value(),
  activities: _.chain(data.person.interests).groupBy(function (i) { return i.type; } ).map(function (interests, interestType) { return [interestType, _.pluck(interests, 'name')]; }).object().value()
};
```

Both of these approaches are time-consuming to write and there is no need for this to be the case.
