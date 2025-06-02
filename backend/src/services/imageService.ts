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
    const images = files.map((file) => ({
      userId,
      url: `/uploads/${file.filename}`,
      title: req.body.title || file.originalname,
      order: 0, // Default order
    }));
    const savedImages = await ImageModel.insertMany(images);
    res.status(201).json(savedImages);
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export const updateImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const image = await ImageModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title: req.body.title, url: req.file ? `/uploads/${req.file.filename}` : undefined },
      { new: true }
    );
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(200).json(image);
  } catch (error) {
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
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(200).json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

export const reorderImages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.id;
    const { images }: { images: { id: string; order: number }[] } = req.body;
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'Images must be an array' });
    }

    // Verify all images belong to the user
    const imageIds = images.map((img) => img.id);
    const userImages = await ImageModel.find({ _id: { $in: imageIds }, userId });
    if (userImages.length !== imageIds.length) {
      return res.status(403).json({ error: 'Invalid image IDs' });
    }

    // Update order for all images
    const updates = images.map((img) =>
      ImageModel.updateOne({ _id: img.id, userId }, { order: img.order })
    );
    await Promise.all(updates);

    // Ensure all images have an order (for any images not included in the request)
    const allImages = await ImageModel.find({ userId });
    const updatedIds = new Set(imageIds);
    const maxOrder = Math.max(...images.map((img) => img.order), 0);
    const remainingUpdates = allImages
      .filter((img) => !updatedIds.has(img._id.toString()))
      .map((img, index) =>
        ImageModel.updateOne(
          { _id: img._id, userId },
          { order: maxOrder + index + 1 }
        )
      );
    await Promise.all(remainingUpdates);

    res.status(200).json({ message: 'Images reordered' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder images' });
  }
};