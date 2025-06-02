import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;
  try {
    await authService.register(email, phone, password);
    res.status(201).json({ message: 'User registered' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password }); // Debug log
  try {
    const { user, token } = await authService.login(email, password);
    console.log('Login successful, token generated:', token); // Debug log
    res.json({ token, user: { _id: user._id.toString(), email: user.email } });
  } catch (error: any) {
    console.error('Login error:', error.message); // Debug log
    res.status(401).json({ error: error.message });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await authService.requestPasswordReset(email);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body;
  try {
    const result = await authService.resetPassword(email, token, newPassword);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};