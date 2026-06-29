const cloudinary = require('../db/cloudinary');

function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file provided' });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'addis-electric', resource_type: 'image' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error.message);
        return res.status(500).json({ success: false, error: 'Image upload failed' });
      }
      return res.json({ success: true, data: { url: result.secure_url } });
    }
  );

  stream.end(req.file.buffer);
}

module.exports = { uploadImage };
