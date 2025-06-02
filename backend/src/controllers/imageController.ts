import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Image as ImageModel } from '../models/Image';
import { AuthRequest } from '../types';

export const uploadImages = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.id;
    const titles = Array.isArray(req.body.titles) ? req.body.titles : [req.body.titles].filter(Boolean);
    const images = files.map((file, index) => ({
      userId,
      url: `/uploads/${file.filename}`,
      title: titles[index] || file.originalname,
      order: 0,
    }));
    const savedImages = await ImageModel.insertMany(images);
    res.status(201).json(savedImages);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};

export const getImages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.id;
    const images = await ImageModel.find({ userId }).sort({ order: 1 });
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export const updateImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const updateData: { title?: string; url?: string } = { title: req.body.title };
    if (req.file) {
      updateData.url = `/uploads/${req.file.filename}`;
    }
    const image = await ImageModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );
    if (!image) {
      return res.status(404).json({ error: 'Image not found or not authorized' });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const image = await ImageModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!image) {
      return res.status(404).json({ error: 'Image not found or not authorized' });
    }
    res.status(200).json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

export const reorderImages = async (req: AuthRequest, res: Response) => {
  console.log('Received reorder request with body:', req.body); // Debug log
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No user found' });
    }
    const userId = req.user.id;
    const { images }: { images: { id: string; order: number }[] } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Images must be a non-empty array' });
    }

    // Validate image IDs
    const imageIds = images.map((img) => img.id);
    if (imageIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: 'One or more image IDs are invalid' });
    }

    // Verify all images belong to the user
    const userImages = await ImageModel.find({ _id: { $in: imageIds }, userId });
    if (userImages.length !== imageIds.length) {
      return res.status(403).json({ error: 'Some images do not belong to the user' });
    }

    // Start a session for atomic updates
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // Update order for provided images
        const updates = images.map((img) =>
          ImageModel.updateOne(
            { _id: img.id, userId },
            { order: img.order },
            { session }
          )
        );
        await Promise.all(updates);

        // Update order for remaining images
        const allImages = await ImageModel.find({ userId }).session(session);
        const updatedIds = new Set(imageIds);
        const maxOrder = Math.max(...images.map((img) => img.order), 0);
        const remainingUpdates = allImages
          .filter((img) => !updatedIds.has(img._id.toString()))
          .map((img, index) =>
            ImageModel.updateOne(
              { _id: img._id, userId },
              { order: maxOrder + index + 1 },
              { session }
            )
          );
        await Promise.all(remainingUpdates);
      });
      res.status(200).json({ message: 'Images reordered successfully' });
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error('Error reordering images:', error);
    res.status(500).json({ error: `Failed to reorder images: ${error.message}` });
  }
};