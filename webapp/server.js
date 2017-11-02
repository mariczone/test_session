const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path');
const app = express();
!process.env.NODE_ENV && (process.env.NODE_ENV = 'dev');
const config = process.env.NODE_ENV.trim() === 'production' ? require('./config/config.production') : require('./config/config.dev');
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

const sessionOptions = {
  store: new RedisStore({
    host: config.redis.host,
    port: config.redis.port,
    ttl: config.redis.expire
  }),
  secret: config.session_secret,
  cookie: { maxAge: config.redis.expire * 1000 },
  rolling: true,
  logErrors: true
}

var redis = require('redis');
var redisClient = redis.createClient(6379, 'docker.cdg.co.th');
redisClient.on('error', function (err) {
  console.log('Redis error: ' + err);
});

//connect to session server
app.use(session(sessionOptions));
//midle ware
app.use('/', function checkSession(req, res, next) {
  if (!req.session.user) {
    res.render('login', {
      config: config.services,
    });
  } else {
    res.render('profile', {
      config: config.services,
      session: req.session,
      vote: req.session.vote,
      //expire: parseInt((req.session.cookie.maxAge / 1000))
      expire: config.redis.expire
    });
  }
});

app.listen(config.server_port, function () {
  console.log('READ server listening on ' + config.server_port);
})