const Fixtures = require('../index');

// The MongoDB Connection URL
const uri = 'mongodb://localhost:27017/mydb';

// The MongoDB native drive options object
const mongoOpts = {};
// const mongoOpts = {
//   ssl: true,
//   sslValidate: true,
//   sslCA: myCert,
// };

const fixtures = new Fixtures({ 
  dir: 'examples/fixtures', 
  filter: '.*' // optional
});
fixtures
  .connect(uri, mongoOpts)
  .then(() => fixtures.unload())
  .then(() => fixtures.load())
  .catch(console.error)
  .finally(() => fixtures.disconnect());

  
