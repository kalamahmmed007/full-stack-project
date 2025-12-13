const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Prevent duplicate products in wishlist
wishlistSchema.index({ user: 1, 'items.product': 1 }, { unique: true });

// Methods
wishlistSchema.methods.addItem = function (productId) {
    const exists = this.items.some(
        item => item.product.toString() === productId.toString()
    );

    if (!exists) {
        this.items.push({ product: productId });
    }
};

wishlistSchema.methods.removeItem = function (productId) {
    this.items = this.items.filter(
        item => item.product.toString() !== productId.toString()
    );
};

wishlistSchema.methods.hasProduct = function (productId) {
    return this.items.some(
        item => item.product.toString() === productId.toString()
    );
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = { Brand, Wishlist };