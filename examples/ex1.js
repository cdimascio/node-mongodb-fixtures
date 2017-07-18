const Promise = require('bluebird');
const Fixtures = require('../index');

// The MongoDB Connection URL
const uri = '<YOUR-URI>'

// The MongoDB options object
// const options = {
//   ssl: true,
//   sslValidate: true,
//   sslCA: myCert,
// };

const fixtures = new Fixtures({ dir: 'examples/fixtures' });
fixtures
  .connect(uri, options, 'mydb')
  .unload()
  .then(() => fixtures.load())
  .catch(e => console.error(e))
  .finally(() => fixtures.disconnect());
