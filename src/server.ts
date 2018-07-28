import * as bunyan from "bunyan";
import * as Koa from "koa";
import * as kunyan from "koa-bunyan";
import * as Router from "koa-router";
import * as hafas from "vbb-hafas";

const logger = bunyan.createLogger({ name: "magali" });

const app = new Koa();

app.use(kunyan(logger, {
  // which level you want to use for logging?
  // default is info
  level: "debug",
  // this is optional. Here you can provide request time in ms,
  // and all requests longer than specified time will have level 'warn'
  timeLimit: 100,
}));

const router = new Router();
router.get("/vbb/stations/:query", async (ctx) => {
  const locations = await hafas.locations(ctx.params.query, {
    addresses: false,
    poi: false,
    results: 3,
  });
  ctx.body = locations.shift();
});
router.get("/vbb/departures/:station", async (ctx) => {
  const locations = await hafas.locations(ctx.params.station, {
    addresses: false,
    poi: false,
    results: 3,
  });
  const station = locations.shift();
  logger.debug("Looking for departures from station: ", station);
  const departures = await hafas.departures(station.id, {
    duration: 30,
  });
  ctx.body = departures;
});

router.get("/*", async (ctx) => {
  ctx.body = "Hello World!";
});

app.use(router.routes());

app.listen(3000);

logger.info("Server running on port 3000");
