/**
 * Copyright Carmine M DiMascio 2017-2021
 * License: MIT
 */
const Promise = require('bluebird');
const { MongoClient } = require('mongodb');
const assert = require('assert');

function Db(uri, options) {
  assert(uri, 'required uri');
  this._options = options || {};
  this._options.useNewUrlParser = true;
  this._options.promiseLibrary = Promise;
  this._uri = uri;
  this._client;
}

Db.prototype.connect = function(dbName) {
  this._client = new MongoClient(this._uri, this._options);
  return this._client.connect().then(client => client.db(dbName));
};

Db.prototype.close = function(dbName) {
  if (this._client) {
    this._client.close();
  }
};

module.exports = Db;
