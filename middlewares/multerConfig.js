// import multer from 'multer';
import path from 'path';
import multer from 'multer';

// Define storage settings using memoryStorage
const storage = multer.memoryStorage(); 

// Create Multer instance with file filter
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only specific file types if needed
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

export default upload;
