# node-mongodb-fixtures

![](https://img.shields.io/badge/status-stable-green.svg) ![](https://img.shields.io/badge/license-MIT-blue.svg)

Setup and tear down test fixtures with MongoDB.

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
fixtures.load()
```  

### Unload

```javascript
fixtures.unload()
```  

### Disconnect

```javascript
fixtures.disconnect()
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
    -c --ssl_ca <base64>  path to cert
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
❯ mongodb-fixtures load -u mongodb://localhost:27017/mydb --path ./examples/fixtures
[info ] Using fixtures directory: /Users/dimascio/git/node-mongodb-fixtures/examples/fixtures
[info ] Using database mydb
[start] load people
[done ] load people
[start] load places
[start] load places
[done ] load places
[done ] *load all
```

## License
[MIT](https://opensource.org/licenses/MIT)