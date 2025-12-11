// backend/routes/brandRoutes.js
import express from 'express';
import {
    listBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
} from '../controllers/brandController.js';
import multer from 'multer';
import path from 'path';

// simple multer config (store files in backend/uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});
const upload = multer({ storage });

const router = express.Router();

// Optional: add auth middleware e.g. isAdmin
// import { protect, admin } from '../middleware/auth.js';

router.get('/', listBrands);
router.get('/:id', getBrand);
router.post('/', upload.single('logo'), createBrand);
router.put('/:id', upload.single('logo'), updateBrand);
router.delete('/:id', deleteBrand);

export default router;
