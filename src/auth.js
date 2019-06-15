const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { Client } = require('./db');
require('dotenv').config();

module.exports = () => {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };
    
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Client.findOne({
            where: {
                id: jwt_payload.id,
            }
        })
            .then((result) => {
                return done(null, result);
            })
            .catch(() => {
                return done(null, false);
            });
    }));
};