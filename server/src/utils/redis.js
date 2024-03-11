const { createClient } = require("redis");

const getClient = async () => {


const client = createClient({
    url: 'redis://redis:6379'
  });

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();
return client;
};

module.exports = { getClient };
