const mongoose = require('mongoose')
const product = require('./product.model')

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, default: "Cafe" }
});

categorySchema.pre('remove', async function(next) {
    try {
        const products = await product.find({
            category: this.id
        })
        if (products.length > 0) {
            next(new Error("Không xóa được"))
        }

    } catch (e) {
        next()
    }
})



module.exports = mongoose.model('category', categorySchema)