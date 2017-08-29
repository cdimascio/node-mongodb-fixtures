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
  .unload()
  .catch(e => console.error(e))
  .then(() => fixtures.load())
  .catch(e => console.error(e))
  .finally(() => fixtures.disconnect());

  