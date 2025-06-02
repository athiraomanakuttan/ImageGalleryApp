import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Manually assign to req as any
    if (typeof decoded === 'object' && 'id' in decoded) {
      (req as any).user = { id: (decoded as any).id };
      next();
    } else {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
