const { connect, config } = require('./client');

init();

async function init(){
  const client = await connect();
  await handleDatabaseCreation(client);
  await handleUserCreation(client);
  await client.end();
}

async function handleDatabaseCreation(client){
  const { database } = config;
  const { rows: databases } = await client.query('SELECT datname AS database FROM pg_database;');
  if(notExists(databases, 'database', database)) {
    await client.query(`CREATE DATABASE ${database};`);
  }
}

async function handleUserCreation(client){
  const { username, password } = config;
  const { rows: users } = await client.query('SELECT usename AS username FROM pg_catalog.pg_user;');
  if(notExists(users, 'username', username)) {
    await client.query(`CREATE ROLE ${username} WITH LOGIN PASSWORD ${password}`);
  }
}

function notExists(items, attr, name){
  return !items.find(item => item[attr] == name);
}
