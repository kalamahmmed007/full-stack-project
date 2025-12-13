const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { errorHandler, notFound } = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const { categoryRoutes, reviewRoutes, couponRoutes } = require('./routes/additionalRoutes');
const { orderRoutes, cartRoutes } = require('./routes/orderCartRoutes');

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['price', 'rating', 'category']
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

app.use('/api', limiter);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/products`, productRoutes);
app.use(`/api/${API_VERSION}/categories`, categoryRoutes);
app.use(`/api/${API_VERSION}/orders`, orderRoutes);
app.use(`/api/${API_VERSION}/cart`, cartRoutes);
app.use(`/api/${API_VERSION}/reviews`, reviewRoutes);
app.use(`/api/${API_VERSION}/coupons`, couponRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;