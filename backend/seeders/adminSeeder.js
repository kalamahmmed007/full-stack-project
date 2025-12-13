require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const { Brand } = require('../models/Brand');

// Connect to database
connectDB();

// Sample data
const adminData = {
    firstName: 'Admin',
    lastName: 'User',
    email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
    isVerified: true,
    isActive: true
};

const categories = [
    {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        isFeatured: true,
        order: 1
    },
    {
        name: 'Fashion',
        description: 'Clothing, shoes, and accessories',
        isFeatured: true,
        order: 2
    },
    {
        name: 'Home & Living',
        description: 'Furniture, decor, and home essentials',
        isFeatured: true,
        order: 3
    },
    {
        name: 'Beauty & Personal Care',
        description: 'Cosmetics, skincare, and personal care products',
        order: 4
    },
    {
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor gear',
        order: 5
    },
    {
        name: 'Books & Media',
        description: 'Books, movies, music, and games',
        order: 6
    },
    {
        name: 'Toys & Games',
        description: 'Toys, games, and hobby items',
        order: 7
    },
    {
        name: 'Health & Wellness',
        description: 'Health supplements and wellness products',
        order: 8
    }
];

const brands = [
    { name: 'Samsung', isFeatured: true },
    { name: 'Apple', isFeatured: true },
    { name: 'Nike', isFeatured: true },
    { name: 'Adidas', isFeatured: true },
    { name: 'Sony', isFeatured: false },
    { name: 'LG', isFeatured: false },
    { name: 'Puma', isFeatured: false },
    { name: 'Reebok', isFeatured: false }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await User.deleteMany({ role: 'admin' });
        await Category.deleteMany({});
        await Brand.deleteMany({});

        console.log('✅ Cleared existing data');

        // Create admin user
        const admin = await User.create(adminData);
        console.log(`✅ Admin created: ${admin.email}`);

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ Created ${createdCategories.length} categories`);

        // Create brands
        const createdBrands = await Brand.insertMany(brands);
        console.log(`✅ Created ${createdBrands.length} brands`);

        console.log(`
    ╔════════════════════════════════════════╗
    ║       Database Seeded Successfully     ║
    ╠════════════════════════════════════════╣
    ║  Admin Email: ${admin.email.padEnd(22)}║
    ║  Admin Password: ${(process.env.ADMIN_PASSWORD || 'Admin@123456').padEnd(18)}║
    ║  Categories: ${createdCategories.length.toString().padEnd(25)}║
    ║  Brands: ${createdBrands.length.toString().padEnd(29)}║
    ╚════════════════════════════════════════╝
    `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();