// backend/models/Brand.js
import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    logo: { type: String, default: '' }, // store URL/path
    createdAt: { type: Date, default: Date.now },
});

const Brand = mongoose.model('Brand', BrandSchema);
export default Brand;
