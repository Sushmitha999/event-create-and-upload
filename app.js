const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override')
const path = require("path") 
const app = express();
const upload = require("express-fileupload");

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set("views",path.join(__dirname,"views")) 
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'))


app.set('view engine', 'ejs');
app.use(methodOverride('_method'))

// Body parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(upload());
// Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Globals
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.form_error = req.flash('form_error')
  next();
});

// Routes
app.use('/', require('./routes/events.js'));
app.use('/users', require('./routes/users.js'));
app.use('/uploads', require('./routes/uploads.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
