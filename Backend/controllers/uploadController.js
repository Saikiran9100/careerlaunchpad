// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';

// // Get __dirname in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Create the 'uploads' directory if it doesn't exist
// const uploadsDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
//   console.log("Created 'uploads' directory.");
// }

// // @desc    Upload a single image file
// // @route   POST /api/upload
// // @access  Private (Logged-in users)
// export const uploadImage = (req, res) => {
//   if (!req.file) {
//     res.status(400);
//     throw new Error('No file uploaded. Please select an image.');
//   }
//   const imagePath = `/uploads/${req.file.filename}`;
//   res.status(201).json({
//     message: 'Image uploaded successfully',
//     imagePath: imagePath,
//   });
// };




import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Created 'uploads' directory.");
}

// @desc    Upload a single image file
// @route   POST /api/upload
// @access  Private (Logged-in users)
export const uploadImage = (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded. Please select an image.');
  }

  // Construct the path relative to the server root
  const imagePath = `/uploads/${req.file.filename}`;

  // IMPORTANT: Send back ONLY the path string. 
  // This ensures the frontend receives "/uploads/image-123.jpg" directly.
  res.send(imagePath);
};