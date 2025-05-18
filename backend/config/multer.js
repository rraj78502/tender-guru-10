const multer = require('multer');
const path = require('path');
const winston = require('winston');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Logger for Multer
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/multer.log' }),
    new winston.transports.Console()
  ]
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (req.originalUrl.includes('/createtender') || req.originalUrl.includes('/updatetender')) {
      uploadPath = path.join(__dirname, '../Uploads/tenders');
    } else if (req.originalUrl.includes('/createcommittees') || req.originalUrl.includes('/updatecommittees')) {
      uploadPath = path.join(__dirname, '../Uploads/committees');
    } else {
      logger.error('Unknown upload route:', req.originalUrl);
      return cb(new Error('Invalid upload route'));
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    logger.info('File upload:', { filename, originalName: file.originalname });
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|doc|docx/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    logger.warn('Invalid file type:', { filename: file.originalname, mimetype: file.mimetype });
    cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Max 10 files per request
  }
});

// Middleware for committee (single file)
const uploadCommitteeLetter = upload.single('formationLetter');

// Middleware for tender (multiple files)
const uploadTenderDocuments = upload.array('documents', 10);

// Function to fetch tag ID by name
const getTagId = async (tagName) => {
  try {
    const response = await axios.get(`${process.env.PAPERLESS_API_URL}/tags/`, {
      headers: { Authorization: `Token ${process.env.PAPERLESS_API_TOKEN}` },
      params: { name__iexact: tagName }
    });
    const tag = response.data.results.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    return tag ? tag.id : null;
  } catch (error) {
    logger.error('Error fetching tag ID:', { tagName, error: error.message });
    return null;
  }
};

// Function to fetch document type ID by name
const getDocumentTypeId = async (typeName) => {
  try {
    const response = await axios.get(`${process.env.PAPERLESS_API_URL}/document_types/`, {
      headers: { Authorization: `Token ${process.env.PAPERLESS_API_TOKEN}` },
      params: { name__iexact: typeName }
    });
    const docType = response.data.results.find(t => t.name.toLowerCase() === typeName.toLowerCase());
    return docType ? docType.id : null;
  } catch (error) {
    logger.error('Error fetching document type ID:', { typeName, error: error.message });
    return null;
  }
};

// Function to upload file to Paperless-ngx via API
const uploadToPaperless = async (file, metadata = {}) => {
  try {
    const form = new FormData();
    form.append('document', fs.createReadStream(file.path), file.originalname);
    form.append('title', metadata.title || file.originalname);

    // Fetch tag and document type IDs
    if (metadata.tags) {
      const tagIds = [];
      for (const tag of metadata.tags) {
        const tagId = await getTagId(tag);
        if (tagId) tagIds.push(tagId);
      }
      if (tagIds.length > 0) form.append('tags', tagIds.join(','));
    }
    if (metadata.document_type) {
      const docTypeId = await getDocumentTypeId(metadata.document_type);
      if (docTypeId) form.append('document_type', docTypeId);
    }

    const response = await axios.post(
      `${process.env.PAPERLESS_API_URL}/documents/post_document/`,
      form,
      {
        headers: {
          Authorization: `Token ${process.env.PAPERLESS_API_TOKEN}`,
          ...form.getHeaders(),
        },
      }
    );

    logger.info('File uploaded to Paperless-ngx:', {
      filename: file.originalname,
      paperlessId: response.data.id,
    });
    return response.data;
  } catch (error) {
    logger.error('Error uploading to Paperless-ngx:', {
      filename: file.originalname,
      error: error.message,
      response: error.response ? error.response.data : null,
    });
    return null; // Return null to allow local storage to proceed
  }
};

module.exports = {
  upload,
  uploadCommitteeLetter,
  uploadTenderDocuments,
  uploadToPaperless
};