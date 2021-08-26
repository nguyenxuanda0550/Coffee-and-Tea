const express = require('express')
const productModel = require('../models/product.model')
const cartModel = require('../models/cart.model')
const orderModel = require('../models/order.model')
const session = require('express-session')
const router = express.Router()

router.get('/', async(req, res) => {
    try {
        // console.log(req.session.cart.items[0].item)
        // req.session.cart = null
        // const cart = req.session.cart.items
        let cart = []
        let total = 0
        if (req.session.cart) {
            cart = req.session.cart.items
            total = req.session.cart.priceTotal

        }
        res.render('carts/cart', { cart: cart, total: total })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})
router.get('/add/:id', async(req, res) => {
    try {
        // const id=req.params.id
        const product = await productModel.findById(req.params.id)

        const cart = new cartModel(req.session.cart ? req.session.cart : { items: [] })
        cart.add(product, req.params.id, product.imageSrc)
        req.session.cart = cart
        res.redirect('/cart')
    } catch (e) {
        console.log(e.message)
        res.redirect('/')
    }
})


router.delete('/delete/:id', (req, res) => {
    try {

        const cart = new cartModel(req.session.cart)
        cart.delete(req.params.id)
        req.session.cart = cart
        res.send("Delete Successfully")
            // res.redirect('/cart')
    } catch (e) {
        res.send("delete failed")
        console.log(e.message)
            // res.redirect('/')
    }

})


router.put('/reduce/:id', (req, res) => {
    try {

        const cart = new cartModel(req.session.cart)
        cart.reduce(req.params.id)
        req.session.cart = cart
            // res.redirect('/cart')
        res.send("Update Successfully")

    } catch (e) {
        res.send("Update failed")
        console.log(e.message)
            // res.redirect('/')
    }

})

router.put('/increase/:id', (req, res) => {
    try {

        const cart = new cartModel(req.session.cart)
        cart.increase(req.params.id)
        req.session.cart = cart
            // res.redirect('/cart')
        res.send("Update Successfully")
    } catch (e) {
        res.send("Update failed")
        console.log(e.message)
            // res.redirect('/')
    }

})

router.get('/checkout', (req, res) => {
    try {
        if (!req.session.cart) {
            res.redirect('/cart')
        }

        const cart = new cartModel(req.session.cart)
        const total = new Intl.NumberFormat().format(cart.priceTotal)

        res.render("carts/checkout", { product: cart.items, total: total })
    } catch (e) {
        res.send("Update failed")
        console.log(e.message)
            // res.redirect('/')
    }

})


router.post('/order', async(req, res) => {
    try {

        const cart = new cartModel(req.session.cart)
        const order = new orderModel({
            user: req.user,
            cart: cart,
            address: req.body.address
        })
        req.session.cart = null
        req.flash("success", "Order succesfully")
        await order.save()
        res.redirect('/')

    } catch (e) {
        // res.send("Update failed")
        console.log(e.message)
        res.redirect('/cart/checkout')
    }

})

module.exports = router