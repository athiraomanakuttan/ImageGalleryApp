import { User } from '../models/User';

export class UserRepository {
  async create(userData: { email: string; phone: string; password: string }) {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findById(id: string) {
    return await User.findById(id);
  }

  async updateResetToken(email: string, token: string, expiry: Date) {
    return await User.updateOne({ email }, { resetToken: token, resetTokenExpiry: expiry });
  }

  async updatePassword(email: string, password: string) {
    return await User.updateOne({ email }, { password });
  }
}