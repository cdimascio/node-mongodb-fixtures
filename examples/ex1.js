const Fixtures = require('../index');

// The MongoDB Connection URL
const uri = '<YOUR-URI>';

// The MongoDB options object
const mongoOpts = {};
// const mongoOpts = {
//   ssl: true,
//   sslValidate: true,
//   sslCA: myCert,
// };

const fixtures = new Fixtures({ dir: 'examples/fixtures' });
fixtures
  .connect(uri, mongoOpts)
  .then(() => fixtures.unload())
  .then(() => fixtures.load())
  .catch(console.error)
  .finally(() => fixtures.disconnect());

  