const express = require('express')
const bcrypt = require('bcrypt')
const userModel = require('../models/user.model')
const passport = require('passport')
const router = express.Router()


router.get('/', async(req, res) => {
    try {
        const user = await userModel.find()
        res.render('users/list', { user: user })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }

})

router.get('/register', async(req, res) => {
    const user = await userModel.find()
    res.render('users/register', { user: user })
})

function check(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/user/login')
}

router.get('/profile', check, (req, res) => {
    let value = "No name"
    if (req.user) {
        value = "name: " + req.user.name
    }
    res.render('users/profile', { name: value })
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('login')
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}))



router.get('/github', passport.authenticate('github'))

router.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}))

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}))



router.post('/', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await user.save()
        req.flash("success", "Insert succesfull")
        res.redirect('/user')

    } catch (e) {
        req.flash("error", "Insert failed")
        console.log(e)
        res.redirect('/')
    }
})


router.delete('/delete/:id', async(req, res) => {
    try {

        const userDelete = await userModel.findById(req.params.id)
        await userDelete.remove()
        req.flash("success", "delete successfull")
        res.redirect('/user')
    } catch (e) {
        console.log(e)
        req.flash("error", "delete failed")
        res.redirect('/')

    }
})

module.exports = router;