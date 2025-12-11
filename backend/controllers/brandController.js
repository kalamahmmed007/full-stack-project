// backend/controllers/brandController.js
import Brand from '../models/Brand.js';
import fs from 'fs';
import path from 'path';

/**
 * NOTE:
 * - This assumes you use multer (or similar) to handle file uploads,
 *   and that uploaded file's path is in req.file.path or req.file.filename.
 * - Alternatively you can accept a `logo` URL string in the body.
 */

export const listBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.json({ success: true, data: brands });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
        res.json({ success: true, data: brand });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        let logo = '';

        if (req.file) {
            // If multer saves file to /uploads, keep its relative path or build URL
            logo = `/uploads/${req.file.filename}`;
        } else if (req.body.logo) {
            logo = req.body.logo; // accept direct URL
        }

        const exists = await Brand.findOne({ name });
        if (exists) return res.status(400).json({ success: false, message: 'Brand already exists' });

        const brand = await Brand.create({ name, logo });
        res.status(201).json({ success: true, data: brand });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });

        if (req.file) {
            // delete old file if stored locally (optional)
            if (brand.logo && brand.logo.startsWith('/uploads')) {
                const oldPath = path.join(process.cwd(), brand.logo);
                fs.unlink(oldPath, (e) => { });
            }
            brand.logo = `/uploads/${req.file.filename}`;
        } else if (req.body.logo) {
            brand.logo = req.body.logo;
        }

        if (name) brand.name = name;
        await brand.save();

        res.json({ success: true, data: brand });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });

        // Optionally delete logo file if local
        if (brand.logo && brand.logo.startsWith('/uploads')) {
            const filePath = path.join(process.cwd(), brand.logo);
            fs.unlink(filePath, (e) => { });
        }

        await brand.remove();
        res.json({ success: true, message: 'Brand deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
