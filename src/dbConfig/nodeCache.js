import NodeCache from "node-cache";
import Redis from "ioredis";

const myCache = new Redis(
  `redis://default:${process.env.REDIS_PASSWORD}@apn1-credible-sawfish-34328.upstash.io:34328`
);

// const myCache = new NodeCache();

export default myCache;
