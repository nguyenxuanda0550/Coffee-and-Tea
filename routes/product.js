const express = require('express')
const categoryModel = require('../models/category.model')
const productModel = require('../models/product.model')
const Regex = require("regex");
const router = express.Router()

router.get('/', async(req, res) => {
    try {
        const products = await productModel.find().populate('category', ['name'])
        res.render('products/list', { products: products })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }


})

router.get('/add', async(req, res) => {
    const product = new productModel()
    const category = await categoryModel.find()
    res.render('products/add', { product: product, category: category })
})

router.post('/', async(req, res) => {

    try {
        const productNew = new productModel({
            name: req.body.name,
            info: req.body.info,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category
        })
        if (req.body.image != null && req.body.image !== '') {
            const imageEncode = JSON.parse(req.body.image)
            productNew.imageType = imageEncode.type
            productNew.imageData = new Buffer.from(imageEncode.data, 'base64')
        }
        await productNew.save()
        res.redirect('/product')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})


router.get('/edit/:id', async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        const category = await categoryModel.find()
        res.render('products/edit', { product: product, category: category })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.put('/edit/:id', async(req, res) => {
    try {
        let pro = await productModel.findById(req.params.id)
        pro.name = req.body.name
        pro.info = req.body.info
        pro.price = req.body.price
        pro.quantity = req.body.quantity
        pro.category = req.body.category
        await pro.save()
        res.redirect('/product')

    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.delete('/delete/:id', async(req, res) => {
    try {
        const productDelete = await productModel.findById(req.params.id)
        await productDelete.remove()
        res.redirect('/product')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }

})

// router.get('/search/:name', async(req, res) => {
//     try {
//         const product = new productModel.find(req.params.name)
//         pro.name = req.body.name
//         pro.info = req.body.info
//         pro.price = req.body.price
//         pro.quantity = req.body.quantity
//         pro.category = req.body.category
//         await pro.save()
//         res.redirect('/product')

//     } catch (e) {
//         console.log(e)
//         res.redirect('/')
//     }
// })


// router.get('/search/:name', function(req, res) {
//     var regex = new RegExp(req.params.name, 'i')
//     productModel.find({ name: regex }).then((result) => {
//         res.status(200).json(result)
//     })

// })

module.exports = router