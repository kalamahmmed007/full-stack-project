// Coupon Model
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount cannot be negative']
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        total: Number,
        perUser: {
            type: Number,
            default: 1
        }
    },
    usageCount: {
        type: Number,
        default: 0
    },
    usedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        usedAt: {
            type: Date,
            default: Date.now
        },
        orderAmount: Number
    }],
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Check if coupon is valid
couponSchema.methods.isValid = function () {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.startDate &&
        now <= this.endDate &&
        (!this.usageLimit.total || this.usageCount < this.usageLimit.total)
    );
};

// Calculate discount
couponSchema.methods.calculateDiscount = function (subtotal) {
    if (!this.isValid() || subtotal < this.minPurchase) {
        return 0;
    }

    let discount = 0;
    if (this.discountType === 'percentage') {
        discount = (subtotal * this.discountValue) / 100;
        if (this.maxDiscount && discount > this.maxDiscount) {
            discount = this.maxDiscount;
        }
    } else {
        discount = this.discountValue;
    }

    return Math.min(discount, subtotal);
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = { Address, Coupon };