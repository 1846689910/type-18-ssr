import Path from "path";
import Koa from "koa";
import serve from "koa-static";
import Router from "koa-router";
import { middleware as ssrMiddleware } from "../express/ssr-middleware";
import c2k from "koa-connect";
import chalk from "chalk";

const PORT = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();

app.use(serve(Path.resolve("dist"), { maxAge: "30d", index: false }));

app.use(c2k(ssrMiddleware));

app.listen(PORT, () => console.log(chalk.bold.blue(`Koa server is running at http://localhost:${PORT}`)));