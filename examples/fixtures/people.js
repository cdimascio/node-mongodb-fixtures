// use js modules to programmatically manipulate fixture data
var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: ObjectId(),
    name: 'Carmine',
    address: {
      city: 'Boston',
      state: 'MA',
    },
  },
  {
    _id: ObjectId(),
    name: 'Jimmy',
    address: {
      city: 'Denver',
      state: 'CO',
    },
  },
];
