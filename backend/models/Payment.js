const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    method: {
        type: String,
        enum: ['cash_on_delivery', 'card', 'bkash', 'nagad', 'rocket', 'bank_transfer'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'BDT'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending'
    },
    paymentDetails: {
        cardNumber: String,
        cardHolderName: String,
        bankName: String,
        accountNumber: String,
        mobileNumber: String
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: String,
    refundedAt: Date,
    failureReason: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    paidAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);