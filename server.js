const express = require('express');
const cors = require('cors');
const errorHandler = require('./helpers/error_handler');

const app = express();

const port = process.env.PORT || 8080;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/auth', require('./auth/auth.controller'));
app.use('/collections', require('./controllers/collections.controller'));

app.use(errorHandler);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, ()=>{
    console.log(`app is listening at http://localhost:${port}`);
});

//node --env-file=.env server.js

//const all_routes = require('express-list-endpoints');
//console.log(all_routes(app));