
const passport = require('passport');
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy
const User = require('./auth_repo');

passport.use(new HeaderAPIKeyStrategy(
    { header: 'Api-Key',},
    false,
    function(apikey, done) {
      User.findByApiKey(apikey, function (user) {
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

const isAuthenticated = passport.authenticate('headerapikey', { session: false });
const init = () => passport.initialize();

module.exports = {
  isAuthenticated,
  init
};
