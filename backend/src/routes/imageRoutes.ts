import express from 'express';
import { uploadImages, getImages, updateImage, deleteImage, reorderImages } from '../controllers/imageController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// Place specific route before wildcard route
router.put('/reorder', authMiddleware, reorderImages);
router.post('/upload', authMiddleware, upload.array('images'), uploadImages);
router.get('/', authMiddleware, getImages);
router.put('/:id', authMiddleware, upload.single('image'), updateImage);
router.delete('/:id', authMiddleware, deleteImage);

export default router;