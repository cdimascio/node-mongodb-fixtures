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
  this._scripts = [];
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

  return this._db.then(db => {
    return readdir(this._dir)
      .then(files => {
        const promises = files.map(file => {
          const parse = path.parse(file);
          const ext = parse.ext.toLowerCase();
          const collectionName = parse.name;

          if (!isSupportedExt(ext)) {
            return null;
          } else if (isScript(collectionName, ext)) {
            const filePath = path.join(this._dir, file);
            return this._scripts.push(filePath);
          }

          return readCollectionFromJsJson(path.join(this._dir, file))
            .tap(() => console.log('[start] load', collectionName))
            .then(docs => {
              if (!Array.isArray(docs)) {
                throw new Error(
                  '[error] no docs returned from file: "' + file + '". verify that a docs array was exported. note: if using .js files, use "module.exports", instead of "exports".');
              }
              return Promise.resolve(
                db.collection(collectionName)
              ).then(collection => {
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
                  .tapCatch(e =>
                    console.log('[error]', collectionName, e.message)
                  );
              });
            });
        });
        return Promise.all(promises).tap(() =>
          console.log('[done ] *load all')
        );
      })
      .then(() => runScripts(db, this._scripts));
  });
};

Fixtures.prototype.unload = function() {
  assert(this._db, 'must call connect');

  return this._db.then(db => {
    return readdir(this._dir).then(files => {
      const promises = files.map(file => {
        const parse = path.parse(file);
        const collectionName = parse.name;
        const ext = parse.ext;

        if (!isSupportedExt(ext) || isScript(collectionName, ext)) {
          return null;
        }

        const filePath = path.join(this._dir, file);
        return Promise.resolve(db)
          .tap(() => console.log('[start] unload', collectionName))
          .then(db => db.collection(collectionName))
          .then(collection => collection.drop())
          .tap(() => console.log('[done ] unload', collectionName))
          .tapCatch(e =>
            console.log('[skipping] unload', collectionName, e.message)
          );
      });
      return Promise.all(promises).tap(() =>
        console.log('[done ] *unload all')
      );
    });
  });
};

Fixtures.prototype.disconnect = function() {
  if (this._client) {
    this._client.close();
  }
};

function runScripts(db, scripts) {
  const promises = scripts.map(script => {
    const parse = path.parse(script);
    const name = parse.name;
    const base = parse.base;
    const collectionName = name.substring(0, name.length - 1);
    return Promise.resolve(db.collection(collectionName)).then(collection => {
      console.log('[start] script', base);
      const r = require(script)(collection);
      if (!r || !r.then) {
        return Promise.reject('[error] script', base, 'must return a promise');
      }
      return r.then(r => {
        console.log('[done ] script', base);
        return r;
      });
    });
  });
  return Promise.all(promises).tap(() => console.log('[done ] *script all'));
}

function readCollectionFromJsJson(file) {
  const parse = path.parse(file);
  const collectionName = parse.name;
  const fileExt = parse.ext.toLowerCase();
  // TODO use streams
  if (['.js', '.ts'].indexOf(fileExt) > -1 && fileExt.length === 3) {
    const docs = require(file);
    return Promise.resolve(docs);
  } else if (fileExt === '.json') {
    return readFile(file).then(contents => {
      let docs = [];
      try {
        return JSON.parse(contents);
      } catch (e) {
        throw new Error(
          '[error] ' + collectionName + ' in ' + file + ': ' + e.message
        );
      }
    });
  }
}

function isSupportedExt(ext) {
  return ['.json', 'ts', '.js'].indexOf(ext) > -1;
}

function isScript(name, ext) {
  return name.endsWith('_') && ['ts', '.js'].indexOf(ext) > -1;
}
