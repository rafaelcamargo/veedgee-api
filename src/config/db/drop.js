const { connect, config } = require('./client');

init();

async function init(){
  const { database } = config;
  const client = await connect();
  await client.query(`DROP DATABASE IF EXISTS ${database};`);
  await client.end();
}
