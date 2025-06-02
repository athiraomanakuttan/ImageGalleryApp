import { UserRepository } from '../repositories/userRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(email: string, phone: string, password: string) {
    if (!email || !phone || !password) {
      throw new Error('All fields are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRepo.create({ email, phone, password: hashedPassword });
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment');
    }
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  }

  async requestPasswordReset(email: string) {
    console.log('Requesting password reset for email:', email); // Debug log
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      console.log('User not found for email:', email); // Debug log
      throw new Error('User not found');
    }
    const token = Math.random().toString(36).slice(-8);
    const expiry = new Date(Date.now() + 3600000); // 1 hour
    await this.userRepo.updateResetToken(email, token, expiry);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    try {
      await transporter.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `Use this token to reset your password: ${token}`,
      });
      console.log('Reset email sent successfully to:', email); // Debug log
    } catch (emailError) {
      console.error('Error sending reset email:', emailError); // Debug log
      throw new Error('Failed to send reset email');
    }

    return { message: 'Reset email sent' };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || user.resetToken !== token || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new Error('Invalid or expired token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updatePassword(email, hashedPassword);
    await this.userRepo.updateResetToken(email, '', new Date());
    return { message: 'Password reset successful' };
  }
}