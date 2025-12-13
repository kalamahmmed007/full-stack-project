import orderModel from "../models/orderModel.js"
import userModel from "../models/User.js"

// Create order helper function
const createOrder = async ({ userId, items, amount, address, paymentMethod = "COD", payment = false }) => {
    const orderData = {
        userId,
        items,
        amount,
        address,
        paymentMethod,
        payment,
        date: Date.now()
    }
    const newOrder = new orderModel(orderData)
    await newOrder.save()

    // Clear user's cart after order
    await userModel.findByIdAndUpdate(userId, { cartData: {} })

    return newOrder
}

// Place order (COD)
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const order = await createOrder({ userId, items, amount, address })

        res.json({ success: true, message: "Order Placed", order })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Placing orders using Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address, payment } = req.body

        const order = await createOrder({ userId, items, amount, address, paymentMethod: "Stripe", payment })

        res.json({ success: true, message: "Order Placed via Stripe", order })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Placing orders using Razorpay
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address, payment } = req.body

        const order = await createOrder({ userId, items, amount, address, paymentMethod: "Razorpay", payment })

        res.json({ success: true, message: "Order Placed via Razorpay", order })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// User order data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Order Status Updated" })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { createOrder, placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, updateStatus, userOrders }
