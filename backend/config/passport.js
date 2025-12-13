const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// ============ JWT STRATEGY ============
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id).select('-password');

            if (user) {
                return done(null, user);
            }

            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

// ============ GOOGLE OAUTH STRATEGY ============
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/v1/auth/google/callback`,
                scope: ['profile', 'email']
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // User exists, check if Google ID is linked
                        if (!user.googleId) {
                            user.googleId = profile.id;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Create new user
                    user = await User.create({
                        googleId: profile.id,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        avatar: {
                            url: profile.photos[0]?.value || '',
                        },
                        isVerified: true,
                        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) // Random password
                    });

                    done(null, user);
                } catch (error) {
                    done(error, false);
                }
            }
        )
    );
}

// ============ FACEBOOK OAUTH STRATEGY ============
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/v1/auth/facebook/callback`,
                profileFields: ['id', 'emails', 'name', 'picture.type(large)']
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // User exists, check if Facebook ID is linked
                        if (!user.facebookId) {
                            user.facebookId = profile.id;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Create new user
                    user = await User.create({
                        facebookId: profile.id,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        avatar: {
                            url: profile.photos[0]?.value || '',
                        },
                        isVerified: true,
                        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) // Random password
                    });

                    done(null, user);
                } catch (error) {
                    done(error, false);
                }
            }
        )
    );
}

// ============ SERIALIZE/DESERIALIZE USER ============
// Required for session-based authentication (optional)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password');
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;