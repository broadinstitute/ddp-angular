import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.DOTENV_CONFIG });

console.log('');

// Note: If DOTENV_CONFIG environment variable is undefined, ".env" config file is used as default.
[
  'DOTENV_CONFIG'
].forEach((k) => {
  console.log(`${k}: ${process.env[k]}`);
});
console.log('');
