# examples

## Preqs

Start a local MongoDB instance

You may also use a externally hosted mongo db. If so, update `ex1.js` with the appropriate credentials

## Run

```
cd .. # to the project root (not the examples folder)
node examples/ex1.js
```

## What did it do?

Using the files in, `fixtures/`... 

It created two collections,

- people
- places

It populated those collections with the data provided in the `.json` and `js` files present in `fixtures/`

It also created an index on `address.city` (see `people_.js`)