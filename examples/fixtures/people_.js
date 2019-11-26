module.exports = function(collection) {
  // create an index (or do other work)
  // Be sure to return a Promise
  return collection.createIndex( { "address.city": 1 }, { unique: false } );
}
