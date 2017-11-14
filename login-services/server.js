const express = require('express')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const app = express()
const bodyParser = require('body-parser')
//  load config from cmd start -- production or dev
!process.env.NODE_ENV && (process.env.NODE_ENV = 'dev')
const config = process.env.NODE_ENV.trim() === 'production' ? require('./config/config.production') : require('./config/config.dev')

//  init Express session and Session Storage(Redis server)
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

//  conect database
var mongoose = require('mongoose')
var _user = require('./models/users')
var url = config.db.url
mongoose.connect(url, { useMongoClient: true })
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connected correctly to mongodb')
  console.log('inserting dummy data ... ')

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  //  Remove Old data and insert new Dummy Data to Mongoose Database
  require('./dummydata.js').gendummydata(function () {
    console.log('insert dummy data finished!')

    //  Check connection to Redis Server
    var redis = require('redis')
    var redisClient = redis.createClient(6379, config.redis.host)
    redisClient.on('error', function (err) {
      console.log('Redis error: ' + err)
    })

    redisClient.on('connect', function () {
      console.log('Redis connect: ' + config.redis.host)
    })

    //  connect to session server
    app.use(session(sessionOptions))

    // Login API
    app.post('/svc/login', function (req, res) {
      if (req.session && !req.session.user) {
        _user.findOne({ USERNAME: req.body.username }, '-_id USERNAME PASSWORD NAME DATE createdAt', function (v, user) {
          if (!user) {
            res.json({
              success: false,
              message: 'Invalid username or password.'
            })
          } else {
            if (req.body.password === user['PASSWORD']) {
              // sets a cookie with the user's info
              req.session.user = user.toJSON()
              res.json({
                success: true,
                message: 'you are now logged in',
                user: req.session.user
              })
            } else {
              res.json({
                success: false,
                message: 'Invalid username or password.'
              })
            }
          }
        })
      } else {
        res.json({
          success: false,
          message: 'You already sign on.'
        })
      }
    })

    // Vote API
    app.get('/svc/vote', requireLogin, function incrementCounter (req, res) {
      if (req.session.vote) {
        req.session.vote++
      } else {
        req.session.vote = 1
      }
      res.json({
        success: true,
        message: 'vote Count',
        vote: req.session.vote,
        // expire: parseInt((req.session.cookie.maxAge / 1000))
        expire: config.redis.expire
      })
    })

    // Logout API
    app.get('/svc/logout', function destroySession (req, res) {
      if (req.session) {
        req.session.destroy(function done () {
          res.json({
            success: true,
            message: 'logged out success.'
          })
        })
      }
    })

    // Utility Function
    function requireLogin (req, res, next) {
      if (req.session && req.session.user) {
        next()
      } else {
        res.json({
          success: false,
          message: 'Unauthorized: Access is denied'
        })
      }
    };
    app.listen(8090, function () {
      console.log('READ server listening on ' + config.server_port)
    })
  })
})
