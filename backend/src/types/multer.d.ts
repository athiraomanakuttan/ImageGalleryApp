import { Request } from 'express';

declare module 'multer' {
  // Redefine FileFilterCallback to allow error: Error | null
  export type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

  // Update Options to use the custom FileFilterCallback
  interface Options {
    fileFilter?: (
      req: Request,
      file: Express.Multer.File,
      callback: FileFilterCallback
    ) => void;
  }
}