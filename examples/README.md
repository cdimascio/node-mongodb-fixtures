# examples

## Preqs

Start a local MongoDB instance

You may also use a externally hosted mongo db. If so, update `ex1.js` with the appropriate credentials

## Run (programmatic via a script)

```shell
cd .. # to the project root (not the examples folder)
node examples/ex1.js
```

## Run (via the cli)

```shell
cd ..  # to the project root (not the examples folder)

# create and load the db
./bin/mongodb-fixtures.js load -u mongodb://localhost:27017/mydb -p examples/fixtures

# unload the db
./bin/mongodb-fixtures.js unload -u mongodb://localhost:27017/mydb -p examples/fixtures
```


## What did it do?

Using the files in, `fixtures/`... 

It created two collections,

- people
- places

It populated those collections with the data provided in the `.json` and `js` files present in `fixtures/`

It also created an index on `address.city` (see `people_.js`)

