const { Client } = require('pg');
const client = new Client("postgres://postgres:postgres@127.0.0.1:5434/postgres");
client.connect()
  .then(() => client.query('DELETE FROM "Product"'))
  .then(res => console.log('DELETED: ' + res.rowCount))
  .catch(e => console.error('ERROR:', e.message))
  .finally(() => client.end());
