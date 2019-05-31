const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const keys = require('./config/keys');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');

const app = express();

mongoose.connect(keys.mongoURI, { useCreateIndex: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(error => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

//Make static path for uploads image
app.use('/uploads', express.static('uploads'));

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('cors')());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', passport.authenticate('jwt', {session: false}), analyticsRoutes);
app.use('/api/category', passport.authenticate('jwt', {session: false}), categoryRoutes);
app.use('/api/order', passport.authenticate('jwt', {session: false}), orderRoutes);
app.use('/api/position', passport.authenticate('jwt', {session: false}), positionRoutes);

module.exports = app;
