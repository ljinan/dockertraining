const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();
const client = redis.createClient({
    url: "redis://redis-server:6379",
});

(async () => {
    await client.connect();
    await client.set("visits",0);
});

app.get('/', async (req, res) => {
    process.exit(1);
    const visits = await client.get("visits");
    res.send("Number of visits " + visits);
    await client.set("visits", parseInt(visits) + 1);
});

app.listen(8081, () => {
    console.log('Listening on port 8081');
});