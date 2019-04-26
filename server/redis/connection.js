let redis = require("async-redis")
let client = redis.createClient(
  {
    url: process.env.REDIS_URL ? process.env.REDIS_URL : 'redis://:Lingo@123Jingo@localhost:6379/0',
  }
);

module.exports = {
  client
}

