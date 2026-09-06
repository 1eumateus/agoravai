import multer from 'multer';
import { extname } from 'path';

function makeUpload ({ randomizeFilename, fileFilter, limits } = {}) {
    const storage = multer.diskStorage ({
        destination: function (req, file, cb) {
            cb (null, "uploads/");
        },
        filename: function (req, file, cb) {
            const nome = randomizeFilename
                ? Date.now () + '-' + Math.round (Math.random () * 1e9) + extname (file.originalname)
                : Date.now () + extname (file.originalname);
            cb (null, nome);
        },
    });

    return multer ({ storage, limits, fileFilter });
}

export { makeUpload };
