require('dotenv').config();

const bodyParser        = require('body-parser');
const cookieParser      = require('cookie-parser');
const express           = require('express');
const favicon           = require('serve-favicon');
const mongoose          = require('mongoose');
const logger            = require('morgan');
const path              = require('path');
const session           = require('express-session');
const cookieSession     = require('cookie-session')
const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;
const bcrypt            = require('bcryptjs');
const cors              = require("cors");

const User = require('./models/User')


mongoose
  .connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.kv8vd.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(
  require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true
  })
);

//CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(cors({
  credentials: true,
  origin: ["https://bookexchangeweb.netlify.app"]
}));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
})

// Middleware de Session
  app.set('trust proxy', 1)
  app.use(cookieSession({
      name:'session',
      keys: ['key1', 'key2'],
      sameSite: 'none',
      secure: true
  }))
  app.use(session ({
    secret: `${process.env.SECRETBACK}`,
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: 'none',
        secure: true
    }
}))

//Middleware serialize user
passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

//Middleware deserialize user
passport.deserializeUser((id, callback) => {
  User.findById(id).then((user) => callback(null, user)).catch((err) => callback(err));
});

//Middleware LocalStrategy
passport.use(
  new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          return next(null, false, { message: 'Incorrect username' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return next(null, false, { message: 'Incorrect password' });
        }

        return next(null, user);
      })
      .catch((err) => next(err));
  })
);

//Middleware passport
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express';

// Routes
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);

module.exports = app;
