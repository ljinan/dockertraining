const keys = require('./keys');

//Express App Setup
const express = require('express'); //require express library
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express() //make new express application - the app is the object that is going to receive and response to any http request that is coming from or going back to react application
app.use(cors()); // Cross-Origin Resource Sharing - allows us to make request from 1 domain which the react app is running on to a different domain, where the express api is running on
app.use(bodyParser.json()); //turn incoming request from react app into json value for the express api to work on

// Postgress Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
    ssl:
        process.env.NODE_ENV !== 'production'
        ? false
        : { rejectUnauthorized: false },
});

//pgClient.on('error', () => console.log('Lost PG connection'));

pgClient.on('connect', (client) => {
    client
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((err) => console.log(err));
});
    
    

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000, //if connection is lost, try to reconnect to redis every 1 sec
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values'); //async await syntax

    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => { //callback for async route data handling, redis library does not have promise support, thats why callbacks are being used
        res.send(values); 
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)',[index]);

    res.send({ working: true });
});

app.listen(5000, (err) => {
    console.log('Listening');
});