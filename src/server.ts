import * as Koa from "koa";
import * as Router from "koa-router";
import * as hafas from "vbb-hafas";

const app = new Koa();

app.use(async (ctx, next) => {
  // Log the request to the console
  console.log("Url:", ctx.url);
  // Pass the request to the next middleware function
  await next();
});

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
  console.log("Looking for departures from station: ", station);
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

console.log("Server running on port 3000");
