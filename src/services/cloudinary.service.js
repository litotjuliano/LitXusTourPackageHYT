const cloudinary = require('../../config/cloudinary');

function uploadImageStream(buffer, { folder, public_id }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id, resource_type: 'image', overwrite: true, format: 'jpg' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

function uploadPdfStream(buffer, { folder, public_id }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      // resource_type MUST be 'raw' for non-image binaries like PDFs.
      { folder, public_id, resource_type: 'raw', overwrite: true, format: 'pdf' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

module.exports = { uploadImageStream, uploadPdfStream };
