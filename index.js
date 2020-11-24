const express = require('express');
const session = require('express-session');
const passport = require('passport');
const RedditStrategy = require('passport-reddit').RedditStrategy;
const jquery = require('jquery');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'insecure secret!';
const {
    REDDIT_CONSUMER_KEY,
    REDDIT_CONSUMER_SECRET
} = require('./credentials.json');
const {
    HOSTNAME,
    AUTHORISED_USERS
} = require('./config.json');

app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new RedditStrategy({
    clientID: REDDIT_CONSUMER_KEY,
    clientSecret: REDDIT_CONSUMER_SECRET,
    callbackURL: `${HOSTNAME}/auth/reddit/callback`
}, (accessToken, refreshToken, profile, done) => {
    if (!AUTHORISED_USERS.includes(profile.name)) {
        return done(null, false);
    }
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// TODO: views, routing, etc

app.listen(PORT, () => {
    // sanity checks for our configuration etc
    
    console.log(`aussim-bill-archive is listening on :${PORT}`)
});
