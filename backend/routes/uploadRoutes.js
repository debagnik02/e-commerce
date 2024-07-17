import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function validateFileType(req, file, cb) {
  const allowedExtensions = /jpe?g|png|webp/;
  const allowedMimeTypes = /image\/jpe?g|image\/png|image\/webp/;

  const extValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedMimeTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
}

const upload = multer({ storage, fileFilter: validateFileType });
const uploadSingleImage = upload.single('image');

router.post('/', (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: 'Image uploaded successfully',
      image: `/${req.file.path}`,
    });
  });
});

export default router;
