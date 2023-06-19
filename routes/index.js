const combineRouters = require('koa-combine-routers');

const index = require('./index/index');
const auth = require('./auth');

const router = combineRouters(
  index,
  auth
);

module.exports = router;