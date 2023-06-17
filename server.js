const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const router = require('./routes');
const WS = require('ws');

const app = new Koa();

app.use(koaBody({
  urlencoded: true
}))

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(router());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());


const wsServer = new WS.Server({ server });

const chat = [
  {
    name: "Petr",
    date: '2023-06-17T10:46:20.068Z',
    body: 'Welkoms to our chat'
  },
  {
    name: "Fedor",
    date: '2023-06-17T10:46:20.068Z',
    body: 'This is chat'
  }
];

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    const messageStr = JSON.parse(message);

    chat.push(messageStr);

    const eventData = JSON.stringify({ chat: [messageStr] });

    Array.from(wsServer.clients)
      .filter(client => client.readyState === WS.OPEN)
      .forEach(client => client.send(eventData));
  })

  ws.send(JSON.stringify({ chat }));
})


server.listen(port, (err) => {
  if (err) return console.log(err);
  console.log('Server to listining to port: ' + port);
});
