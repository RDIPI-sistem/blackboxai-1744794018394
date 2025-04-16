require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// i18next configuration
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'ru'],
    backend: {
      loadPath: path.join(__dirname, '/locales/{{lng}}/translation.json')
    }
  });

app.use(i18nextMiddleware.handle(i18next));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'xgame_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Placeholder routes
app.get('/', (req, res) => {
  res.send('XGame Platform Backend is running');
});

// TODO: Add authentication, app/game, rating routes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
