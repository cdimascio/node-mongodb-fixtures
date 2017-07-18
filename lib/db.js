const Promise = require('bluebird');
const { MongoClient } = require('mongodb');
const assert = require('assert');

function Db(uri, options) {
  assert(uri, 'required uri');
  this._options = options || {};
  this._options.promiseLibrary = Promise;
  this._uri = uri;
}

Db.prototype.connect = function(dbName) {
  const connection = MongoClient.connect(this._uri, this._options);
  return dbName ? connection.then(db => db.db(dbName)) : connection;
};

module.exports = Db;
