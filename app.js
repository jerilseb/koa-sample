const Koa = require("koa");
const koaBody = require("koa-body");
const logger = require("koa-logger");
const Routes = require("./routes");

const app = new Koa();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(logger());
app.use(koaBody({ multipart: true }));
app.use(Routes.routes());

const server = app.listen(PORT, () => {
  console.log(`App server listening on port ${PORT}`);
});

module.exports = server;
