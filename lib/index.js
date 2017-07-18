const assert = require('assert');
const Promise = require('bluebird');
const Db = require('./db');
const fs = require('fs');
const path = require('path');

const readdir = Promise.promisify(fs.readdir);
const readFile = Promise.promisify(fs.readFile);
const BATCH_SIZE = 1000;

module.exports = Fixtures;

function Fixtures(options) {
  this._dir = options.dir || 'fixtures';
  console.log('[info ] Using fixtures directory: ' + this._dir);
  return this;
}

Fixtures.prototype.connect = function(uri, options, dbName) {
  assert(uri, 'uri required');
  const db = new Db(uri, options);
  this._db = db.connect(dbName).then(db => {
    this._client = db;
    console.log('[info ] Using database', db.databaseName);
    return db;
  });
  return this;
};

Fixtures.prototype.load = function() {
  assert(this._db, 'must call connect');

  return readdir(this._dir).then(files => {
    const promises = files.map(file => {
      const collectionName = path.parse(file).name;
      const filePath = path.join(this._dir, file);
      // TODO use streams
      return readFile(filePath)
        .tap(() => console.log('[start] load', collectionName))
        .then(contents => {
          let docs = [];
          try {
            docs = JSON.parse(contents);
          } catch (e) {
            throw new Error(
              '[error] ' + collectionName + ' in ' + filePath + ': ' + e.message
            );
          }
          return this._db.then(db => db.collection(collectionName)).then(collection => {
            const batch = collection.initializeUnorderedBulkOp();
            docs.forEach(doc => batch.insert(doc));
            if (batch.length === 0) {
              return {
                ok: true,
                message: '[done ] ' + collectionName + ' load not required',
              };
            }
            return batch
              .execute()
              .tap(() => console.log('[done ] load', collectionName))
              .tapCatch(e => console.log('[error]', collectionName, e.message));
          });
        });
    });
    return Promise.all(promises).tap(() => console.log('[done ] *load all'));
  });
};

Fixtures.prototype.unload = function() {
  assert(this._db, 'must call connect');

  return readdir(this._dir).then(files => {
    const promises = files.map(file => {
      const collectionName = path.parse(file).name;
      const filePath = path.join(this._dir, file);
      return this._db
        .tap(() => console.log('[start] unload', collectionName))
        .then(db => db.collection(collectionName))
        .then(collection => collection.drop())
        .tap(() => console.log('[done ] unload', collectionName))
        .catch(e => console.log('[skipping] unload', collectionName, e.message));
    });
    return Promise.all(promises).tap(() => console.log('[done ] *unload all'));
  });
};

Fixtures.prototype.disconnect = function() {
  if (this._client) {
    this._client.close();
  }
};
