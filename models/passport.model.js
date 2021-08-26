const localStrategy = require('passport-local').Strategy
const githubStrategy = require('passport-github').Strategy
const userModel = require('./user.model')
const bcrypt = require('bcrypt')
module.exports = function(passport) {


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })

    passport.deserializeUser(async(id, done) => {
        try {
            const user = await userModel.findById(id)
            return done(null, user)
        } catch (e) {
            return done(e)
        }
    })

    passport.use(new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async function(email, password, done) {
            const user = await userModel.findOne({ 'email': email })
            if (!user) {
                return done(null, false, { message: "No user with that email" })
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user)
                }
                return done(null, false, { message: 'password incorrect' })

            } catch (e) {
                return done(e)
            }
        }
    ))


    passport.use(new githubStrategy({
            clientID: "b8a9201ecd8e8f1d1934",
            clientSecret: "1be61715325c46bde2c7dc6406aeff8f89fd8876",
            callbackURL: "http://localhost:3000/user/github/callback"
        },
        async function(accessToken, refreshToken, profile, done) {
            console.log(profile)
            try {
                const user = await userModel.findOne({ email: profile._json.email })
                if (user) return done(null, user)
                const newUser = new userModel({
                    name: profile._json.login,
                    email: profile._json.url,
                    password: ""

                })
                await newUser.save()
                return done(null, newUser)
            } catch (e) {
                console.log(e)
                return done(e)
            }
        }
    ))






    // passport.use(new googleStrategy({
    //         clientID: "b8a9201ecd8e8f1d1934",
    //         clientSecret: "1be61715325c46bde2c7dc6406aeff8f89fd8876",
    //         callbackURL: "http://localhost:3000/user/github/callback"
    //     },
    //     async function(accessToken, refreshToken, profile, done) {
    //         console.log(profile)
    //         try {
    //             const user = await userModel.findOne({ email: profile._json.email })
    //             if (user) return done(null, user)
    //             const newUser = new userModel({
    //                 name: profile._json.login,
    //                 email: profile._json.url,
    //                 password: ""

    //             })
    //             await newUser.save()
    //             return done(null, newUser)
    //         } catch (e) {
    //             console.log(e)
    //             return done(e)
    //         }
    //     }
    // ))





}