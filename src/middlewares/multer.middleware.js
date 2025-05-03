import multer from "multer"
import path from "path"
import fs from "fs"

// Define the upload directory (relative to project root)
const uploadDir = path.join('public', 'temp');

// Verify the directory exists (optional since it already exists)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created upload directory: ${uploadDir}`);
} else {
  console.log(`Upload directory already exists: ${uploadDir}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)   //note
    }
  })
  
export const upload = multer({ 
    storage,
 })