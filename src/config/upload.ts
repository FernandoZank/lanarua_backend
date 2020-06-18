import crypto from 'crypto';
import path from 'path';
import multer from 'multer';
// import AppError from '../errors/AppError';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const [, getExtension] = file.originalname.split('.');
      const fileName = `${fileHash}.${getExtension}`;

      return callback(null, fileName);
    },
  }),
};
