function cart(cart_old) {
    this.items = cart_old.items || []
    this.priceTotal = cart_old.priceTotal || 0
    this.add = function(product, id, imageSrc) {
        const index = this.items.findIndex(s => s.id === id)
        if (index < 0) {
            this.items.push({ id: id, qty: 1, item: product, imageSrc })
        } else {
            this.items[index].qty++
        }
        console.log(product.price)
        this.priceTotal += product.price

    }
    this.delete = function(id) {
        const index = this.items.findIndex(s => s.id === id)
        this.priceTotal -= this.items[index].item.price * this.items[index].qty
        this.items.splice(index, 1)
    }

    this.reduce = function(id) {
        const index = this.items.findIndex(s => s.id === id)
        this.priceTotal -= this.items[index].item.price
        this.items[index].qty--

            if (this.items[index] <= 0) {
                this.items.splice(index, 0)
            }
    }

    this.increase = function(id) {
        const index = this.items.findIndex(s => s.id === id)
        this.priceTotal += this.items[index].item.price
        this.items[index].qty++

    }
}
module.exports = cart