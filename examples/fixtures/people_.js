module.exports = function(collection) {
  return collection.createIndex( { "address.city": 1 }, { unique: false } );
}