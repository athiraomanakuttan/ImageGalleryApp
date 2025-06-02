import { Image } from '../models/Image';

export class ImageRepository {
  async create(imageData: { userId: string; title: string; url: string; order?: number }) {
    const image = new Image(imageData);
    return await image.save();
  }

  async findByUserId(userId: string) {
    return await Image.find({ userId }).sort({ order: 1 });
  }

  async findById(id: string) {
    return await Image.findById(id);
  }

  async update(id: string, updates: { title?: string; url?: string; order?: number }) {
    return await Image.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id: string) {
    return await Image.findByIdAndDelete(id);
  }

  async updateOrder(id: string, order: number) {
    return await Image.findByIdAndUpdate(id, { order }, { new: true });
  }

  async insertMany(images: { userId: string; title: string; url: string; order: number }[]) {
    return await Image.insertMany(images);
  }
}