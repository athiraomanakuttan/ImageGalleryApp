import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import imageRoutes from './routes/imageRoutes';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://image-gallery-frontend-e7bfj87ef-sreeharirs-projects.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

export default app;