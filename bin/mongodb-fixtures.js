#!/usr/bin/env node

/*
  Command line utility (CLI) to create and tear down MongoDB test fixtures
 */

const fs = require('fs');
const program = require('commander');
const path = require('path');
const Fixtures = require('../index');
const pkg = require('../package.json');

const DEFAULT_PATH = 'fixtures';

const required = (val, name) => {
  if (!val) {
    console.error(`${name} required.`);
    process.exit(1);
  }
};

let command;
program.version(pkg.version);

program.command('load').action(cmd => (command = 'load'));

program.command('unload').action(cmd => (command = 'unload'));

program.command('rebuild').action(cmd => (command = 'rebuild'));

program
  .option('-u --url <url>', 'mongo connection string')
  .option('-s --ssl', 'use SSL', false)
  .option('-d --db_name <name>', 'database name', false)
  .option('-n --ssl_novalidate', 'use SSL with no verification', false)
  .option('-c --ssl_ca <path/to/cert>', 'path to cert', false)
  .option('-p --path <path>', 'resource path. Default ./' + DEFAULT_PATH, false)
  .option(
    '-f --filter <pattern>',
    "regex pattern to filter fixture names e.g. '.*people'",
    false
  )
  .option('-b --verbose', 'verbose logs', false);

program.parse(process.argv);

validate();

const dir = program.path
  ? path.isAbsolute(program.path)
    ? program.path
    : path.join(process.cwd(), program.path)
  : path.join(process.cwd(), DEFAULT_PATH);

main({
  command,
  program: program,
  dir,
});

function main(opts) {
  const command = opts.command;
  const program = opts.program;
  const dir = opts.dir;
  const filter = program.filter;

  const uri = program.url;
  const dbName = program.db_name;
  const mongoOptions = { useUnifiedTopology: true };

  if (opts.program.ssl_novalidate) {
    mongoOptions.ssl = true;
    mongoOptions.sslValidate = false;
  }
  if (opts.program.ssl) {
    mongoOptions.ssl = true;
    mongoOptions.sslValidate = true;
  }
  if (opts.program.ssl_ca) {
    mongoOptions.ssl = true;
    mongoOptions.sslCA = [fs.readFileSync(opts.program.ssl_ca)];
  }

  const fixtures = new Fixtures({ dir: dir, filter: filter });

  switch (command) {
    case 'load':
      fixtures
        .connect(uri, mongoOptions, dbName)
        .then(() => fixtures.load())
        .catch(e => console.error(e.message))
        .finally(() => fixtures.disconnect());
      break;
    case 'unload':
      fixtures
        .connect(uri, mongoOptions, dbName)
        .then(() => fixtures.unload())
        .catch(e => console.error(e.message))
        .finally(() => fixtures.disconnect());
      break;
    case 'rebuild':
      fixtures
        .connect(uri, mongoOptions, dbName)
        .then(() => fixtures.unload())
        .catch(e => {})
        .then(() => fixtures.load())
        .catch(e => console.error(e.message))
        .finally(() => fixtures.disconnect());
      break;
    default:
      exit('Invalid command.');
  }
}

function validate() {
  if (!command) exit('Invalid command.');
  if (!program.url) exit('Url required.');
}

function exit(msg) {
  if (msg) {
    console.log('Error: ' + msg);
  }
  program.help();
  process.exit(1);
}
