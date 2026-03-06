// import path from 'path';
// import express from 'express';
// import multer from 'multer';
// import { uploadImage } from '../controllers/uploadController.js'; // <-- Use .js
// import { protect } from '../middleware/authMiddleware.js'; // <-- Use .js

// const router = express.Router();

// // --- Multer Configuration ---
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Images only! (jpg, jpeg, png, gif)'), false);
//   }
// }

// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });
// // --- End Multer Configuration ---

// router.post('/', protect, upload.single('profileImage'), uploadImage);

// export default router; // <-- Use export default




// backend/routes/uploadRoutes.js
import path from 'path';
import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js'; 
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// --- THE FIX: Use 'image' here so it works for everyone ---
router.post('/', protect, upload.single('image'), uploadImage);

export default router;