import { createClient } from "redis";

if (!process.env.REDIS_URL) {
    console.log("REDIS_URL not loaded!");
}

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => console.log("Redis client error: ", err));

let isConnected = false;

export async function getRedisClient() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client;
}
