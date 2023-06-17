const Router = require('koa-router');

const auth = [];

const router = new Router();

router.post('/auth', async(ctx) => {
  console.log(ctx.request.body);

  const { value } = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (auth.some(name => name === value)) {
    ctx.response.status = 400;
    ctx.response.body = { status: "Такое имя уже есть" };

    return;
  }

  auth.push(value);

  ctx.response.body = { status: "OK" };
});

module.exports = router;