import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.DOTENV_CONFIG });

console.log('');

// Note: If DOTENV_CONFIG environment variable is undefined, ".env" config file is used as default.
[
  'DOTENV_CONFIG',
  'USER_NAME',
  'READER_USER',
  'WRITER_USER',
  'ACCESS_TEST_USER',
  'ADMIN_TEST_USER',
  'EGRESS_TEST_USER',
  'RAS_TEST_USER'
].forEach((k) => {
  console.log(`${k}: ${process.env[k]}`);
});
console.log('');
