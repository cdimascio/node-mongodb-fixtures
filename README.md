# node-mongodb-fixtures

![](https://img.shields.io/badge/status-stable-green.svg) [![](https://img.shields.io/npm/v/node-mongodb-fixtures.svg)](https://www.npmjs.com/package/node-mongodb-fixtures) ![](https://img.shields.io/npm/dm/node-mongodb-fixtures.svg) [![](https://img.shields.io/gitter/room/cdimascio-oss/community?color=%23eb205a)](https://gitter.im/cdimascio-oss/community) 
![](https://img.shields.io/badge/license-MIT-blue.svg)

**Setup and tear down test fixtures with MongoDB.**

Use custom scripts to create indexes and more!

![](https://raw.githubusercontent.com/cdimascio/node-mongodb-fixtures/master/assets/mongodb-fixtures-logo.png)

[![GitHub stars](https://img.shields.io/github/stars/cdimascio/node-mongodb-fixtures.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/cdimascio/node-mongodb-fixtures/stargazers/) [![Twitter URL](https://img.shields.io/twitter/url/https/github.com/cdimascio/node-mongodb-fixtures.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20node-mongodb-fixtures%20by%20%40CarmineDiMascio%20https%3A%2F%2Fgithub.com%2Fcdimascio%2Fnode-mongodb-fixtures%20%F0%9F%91%8D)

## Install

```shell
npm install node-mongodb-fixtures
```

### CLI

For CLI use, it can be useful to install globally:

```shell
npm install node-mongodb-fixtures -g
```

## Usage

### Programmatic

```javascript
const Fixtures = require('node-mongodb-fixtures');
const fixtures = new Fixtures();

fixtures
  .connect('mongodb://localhost:27017/mydb')
  .then(() => fixtures.unload())
  .then(() => fixtures.load())
  .then(() => fixtures.disconnect());
```

[See detailed programmatic usage below](#programmatic-usage)

### CLI

```shell
❯ mongodb-fixtures load -u mongodb://localhost:27017/mydb
```

[See detailed cli usage below](#cli-usage)

---

## Try the Example

The following example will load the example fixtures into a locally running MongoDB. To use another DB modify the the connection url accordingly (in step 2)

### Run the example

1. Clone the repo

```shell
git clone https://github.com/cdimascio/node-mongodb-fixtures && cd node-mongodb-fixtures && npm install
```

2. Load the fixtures into MongoDb

```shell
node bin/mongodb-fixtures load -u mongodb://localhost:27017/mydb --path ./examples/fixtures
```

---

## Create fixtures

#### How

1.  Choose a directory for your fixtures e.g. `./fixtures`
2.  Create any mix of JSON (`.json`), JavaScript (`.js`) files. (see file rules below)
3.  Each filename defines a MongoDB collection

**JSON Files**

The name of the JSON file is/will be the collection name. Each JSON file **_must_** contain a 'JSON Array of JSON objects'. Each JSON object is loaded as a document in the collection.

JSON files are useful when you can represent all of your documents as JSON.

```json
[
  { "name": "Paul", "age": 36 }, 
  { "name": "Phoebe", "age": 26 }
]
```

**JavaScript Files**

The name of the JSON file is/will be the collection name. Each `.js` file must return a 'JSON Array of JSON objects'. Each JSON object is loaded as a document in the collection.

JavaScript files are useful when you require code to represent your documents.

```javascript
const { ObjectID: ObjectId } = require('mongodb');

module.exports = [
  { _id: ObjectId(), name: 'Paul', 'age': 36 },
  { _id: ObjectId(), name: 'Phoebe', 'age': 26 },
];
```

#### Example Structure

```
fixtures/
|-- people.js
|-- places.json
```

See `./examples/fixtures`

## Collection Scripts: Indexes and more...

"Collection scripts" enable you to inject your own custom logic in the fixture creation lifecycle. Each custom script is passed a reference to a MongoDB collection. You may use this reference to modify the collection however you like. For example, you can add indexes and more.

### How

1.  Create a new JavaScript file with an underscore `_` suffix. e.g. `people_.js`.
2.  The `_` denotes a script. The text preceding it, `people`, is the collection name.
3.  Each script is passed a single argument, the collection.
4.  Each must return a `function` that takes a `collection` and returns a `Promise`.

#### Example

```javascript
// people_.js
module.exports = function(collection) {
  // Write your custom logic and return a promise
  return collection.createIndex( { "address.city": 1 }, { unique: false } );
}
```

```
fixtures/
|-- people_.js
|-- people.js
|-- places.json
```

**Note:** Custom scripts run after all fixtures have completed.

## Programmatic Usage

### Init

use the default fixtures directory,`./fixtures`

```javascript
const Fixtures = require('node-mongodb-fixtures');
const fixtures = new Fixtures();
```

or specifiy the fixtures directory

```javascript
const Fixtures = require('node-mongodb-fixtures');
const fixtures = new Fixtures({
  dir: 'examples/fixtures',
  mute: false, // do not mute the log output
});
```

or filter the fixtures present in the directory with a Regex pattern

```javascript
const Fixtures = require('node-mongodb-fixtures');
const fixtures = new Fixtures({
  dir: 'examples/fixtures',
  filter: 'people.*',
});
```

### Connect

Use the standard MongoDB [URI connection scheme](https://docs.mongodb.com/manual/reference/connection-string/)

```javascript
fixtures.connect('mongodb://localhost:27017/mydb'); // returns a promise
```

**connect(uri, options, dbName)**

| arg       | type              | description                                                                                                                |
| --------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `uri`     | string (required) | [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/)                                  |
| `options` | object (optional) | [MongoDB connection options](http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect)                |
| `dbName`  | string (optional) | identifies a database to switch to. Useful when the db in the connection string differs from the db you want to connect to |

See: `./examples/ex1.js`

### Load

```javascript
fixtures.load(); // returns a promise
```

### Unload

```javascript
fixtures.unload(); // returns a promise
```

### Disconnect

```javascript
fixtures.disconnect(); // returns a promise
```

## Example

The following example does the following:

- connects to mongo
- then unloads all fixtures
- then loads all fixtures
- then disconnects

```javascript
const Fixtures = require('node-mongodb-fixtures');
const uri = 'mongodb://localhost/mydb';
const options = null;

const fixtures = new Fixtures({
  dir: 'examples/fixtures',
  filter: '.*',
});

fixtures
  .connect('mongodb://localhost:27017/mydb')
  .then(() => fixtures.unload())
  .then(() => fixtures.load())
  .catch(e => console.error(e))
  .finally(() => fixtures.disconnect());
```

## CLI Usage

```shell
❯ mongodb-fixtures

  Usage: mongodb-fixtures [options] [command]


  Options:

    -V, --version         output the version number
    -u --url <url>        mongo connection string
    -s --ssl              use SSL
    -d --db_name <name>   database name
    -n --ssl_novalidate   use SSL with no verification
    -c --ssl_ca </path/to/cert>  path to cert
    -p --path <path>      resource path. Default ./fixtures
    -f --filter <pattern> regex pattern to filter fixture names
    -b --verbose          verbose logs
    -h, --help            output usage information


  Commands:

    load
    unload
    rebuild
```

## Example Output

```shell
[info ] Using fixtures directory: /Users/dimascio/git/node-mongodb-fixtures/examples/fixtures
[info ] Using database mydb
[info ] No filtering in use
[start] load people
[start] load places
[done ] load people
[done ] load places
[done ] *load all
[start] script people_.js
[done ] script people_.js
[done ] *script all
```

## Contributors

Contributors are welcome!

Special thanks to those who have contributed:

- [cdimascio](https://www.github.com/cdimascio)
- [Mykolas-Zenitech](https://github.com/Mykolas-Zenitech)
- [westyside](https://github.com/westyside)
- [mushketyk](https://github.com/mushketyk)
- [leeandher](https://github.com/leeandher)

## License

[MIT](https://opensource.org/licenses/MIT)

<a href="https://www.buymeacoffee.com/m97tA5c" target="_blank"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
