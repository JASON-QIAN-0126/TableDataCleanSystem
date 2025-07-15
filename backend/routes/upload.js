const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.tsv', '.xlsx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, TSV, and XLSX files are allowed.'));
    }
  }
});

// Upload files
router.post('/', authenticateToken, upload.array('files'), (req, res) => {
  try {
    const taskId = uuidv4();
    
    // In demo mode, just return success immediately
    res.json({
      message: 'Files uploaded successfully',
      task_id: taskId,
      files: req.files ? req.files.map(file => file.originalname) : []
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get results (demo mode - always return example file)
router.get('/results/:taskId', (req, res) => {
  const { taskId } = req.params;
  
  // In demo mode, always return the example file
  const exampleFilePath = path.join(__dirname, '../../frontend/public/example_file/Cleaned_data.xlsx');
  res.sendFile(exampleFilePath);
});

module.exports = router; 