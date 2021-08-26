const express = require('express')
const productModel = require('../models/product.model')
const router = express.Router()

router.get('/', async(req, res) => {
    try {
        const product = await productModel.find()
        res.render('index', { product: product })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }

})

module.exports = router