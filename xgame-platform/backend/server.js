require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory user store for demo (not persistent)
const users = new Map();

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user.providerId);
});
passport.deserializeUser((id, done) => {
  const user = users.get(id);
  done(null, user || null);
});

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  let user = users.get(profile.id);
  if (!user) {
    user = {
      providerId: profile.id,
      provider: 'google',
      displayName: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
    };
    users.set(profile.id, user);
  }
  done(null, user);
}));

// Facebook OAuth strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
  clientSecret: process.env.FACEBOOK_APP_SECRET || 'YOUR_FACEBOOK_APP_SECRET',
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email'],
}, (accessToken, refreshToken, profile, done) => {
  let user = users.get(profile.id);
  if (!user) {
    user = {
      providerId: profile.id,
      provider: 'facebook',
      displayName: profile.displayName,
      email: profile.emails ? profile.emails[0].value : '',
      photo: profile.photos ? profile.photos[0].value : '',
    };
    users.set(profile.id, user);
  }
  done(null, user);
}));

app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'xgame_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('XGame Platform Backend with Social Login');
});

// Google auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to frontend or send user info
    res.redirect('http://localhost:8000');
  });

// Facebook auth routes
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to frontend or send user info
    res.redirect('http://localhost:8000');
  });

// Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:8000');
  });
});

// API to get current user info
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
