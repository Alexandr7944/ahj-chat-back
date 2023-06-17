const combineRouters = require('koa-combine-routers');

const auth = require('./auth');

const router = combineRouters(
  auth
);

module.exports = router;