import multer from 'multer';
import { extname } from 'path';

const storage = multer.diskStorage ({
  destination: function (req, file, cb) {
    cb (null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb (null, Date.now () + '-' + Math.round (Math.random () * 1e9) + extname (file.originalname));
  },
});

const uploadFase = multer ({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb (null, true);
    } else {
      cb (new Error ('Apenas arquivos PDF são permitidos.'));
    }
  },
});

export { uploadFase };
