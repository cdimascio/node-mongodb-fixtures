# node-mongodb-fixtures

![](https://img.shields.io/badge/status-stable-green.svg) ![](https://img.shields.io/badge/license-MIT-blue.svg)

**Setup and tear down test fixtures with MongoDB.**
Use custom scripts to create indexes and more!

![](https://github.com/cdimascio/node-mongodb-fixtures/raw/3fd02679f26a21f18d5115626a5759b5866248a9/assets/mongodb-creative-commons.jpeg
)

## Install
```shell
npm install node-mongodb-fixtures
```

### CLI

For CLI use, it can be useful to install globally:

```shell
npm install node-mongodb-fixtures -g
```

---

## Try the Example

The following example will load the example fixtures into a MongoDB database

#### Prequisite
- A valid MongoDB connection string
- node-mongodb-fixtures (*This example assumes it is installed globally*)

### Run
- clone this repo to get the sample fixtures i.e. `./examples/fixtures`
- Execute
	
	```shell
	❯ mongodb-fixtures load -u mongodb://localhost:27017/mydb --path ./examples/fixtures
	```

---

## Usage

### Programmatic
```javascript
const Fixtures = require('node-mongodb-fixtures');
const fixtures = new Fixtures(); 

fixtures.connect('mongodb://localhost:27017/mydb').load() // load
```

[See detailed programmatic usage below](#programmatic-usage)

### CLI

```shell
❯ mongodb-fixtures load -u mongodb://localhost:27017/mydb'
```

[See detailed cli usage below](#cli-usage)


## Create fixtures

#### How

1. Choose a directory for your fixtures e.g. `./fixtures` 
2. Create any mix of JSON (`.json`), JavaScript (`.js`), or Typefiles (`.ts`) files.
3. Each filename defines a MongoDB collection

  JSON files should:

  - Each contain a JSON Array of JSON objects. e.g. 
  - Each JSON object is loaded as a document in the collection.

```json
[
  { "name": "Paul", "age": 36 }, 
  { "name": "Phoebe", "age": 26 }
]
```

  JavaScript (or TypeScript) files should:
	
  - Each return a JSON Array of JSON objects. e.g. 
  - Each JSON object is loaded as a document in the collection.

```JavaScript

var ObjectId = require('mongodb').ObjectID;

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

1. Create a new JavaScript file with an underscore `_` suffix. e.g. `people_.js`.
2. The `_` denotes a script. The text preceding it, `people`, is the collection name.
3. Each script is passed a single argument, the collection.
4. Each must return a `function` that takes a `collection` and returns a `Promise`.

#### Example

```Javascript
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
 dir: 'examples/fixtures' 
}); 
```


### Connect
Use the standard MongoDB [URI connection scheme](https://docs.mongodb.com/manual/reference/connection-string/)

```javascript
fixtures.connect('mongodb://localhost:27017/mydb')
```



**connect(uri, options, dbName)**

| arg  | type | description |
| ------------- | ------------- | ------------- |
| `uri`  | string (required)  | [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/) |
| `options`  | object (optional)  | [MongoDB connection options](http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect) |
| `dbName`  | string (optional)  | identifies a database to switch to. Useful when the db in the connection string differs from the db you want to connect to |

See: `./examples/ex1.js`

### Load

```javascript
fixtures.load() // returns a promise
```  

### Unload

```javascript
fixtures.unload()  // returns a promise
```  

### Disconnect

```javascript
fixtures.disconnect() // returns a promise
```  

## Example

The following example does the following:
- connects to mongo
- then unloads all fixtures
- then load all fixtures
- then disconnects


```javascript
const Fixtures = require('node-mongodb-fixtures');
const uri = 'mongodb://localhost/mydb'
const options = null;

const fixtures = new Fixtures({
 dir: 'examples/fixtures' 
});

fixtures
  .connect('mongodb://localhost:27017/mydb')
  .unload()
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
    -n --ssl_novlidate    use SSL with no verification
    -c --ssl_ca </path/to/cert>  path to cert
    -p --path <path>      resource path. Default ./fixtures
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

- [cdimascio](https://www.github.com/cdimascio)
- [Mykolas-Molis](https://github.com/Mykolas-Molis)

## License
[MIT](https://opensource.org/licenses/MIT)