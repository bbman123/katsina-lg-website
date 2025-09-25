const Media = require('../models/Media');
const cloudinary = require('../config/cloudinary');

// Helper function to extract Cloudinary public ID from URL
const extractPublicId = (url) => {
  try {
    // Example URL: https://res.cloudinary.com/your-cloud/image/upload/v123/folder/publicid.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1) {
      // Get everything after 'upload' and before file extension
      const pathAfterUpload = parts.slice(uploadIndex + 1).join('/');
      // Remove version if present (starts with 'v' followed by numbers)
      const withoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
      // Remove file extension
      const publicId = withoutVersion.replace(/\.[^/.]+$/, '');
      return publicId;
    }
    return null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

// Delete media
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Delete from Cloudinary if it's a Cloudinary URL
    if (media.fileUrl && media.fileUrl.includes('cloudinary.com')) {
      try {
        const publicId = extractPublicId(media.fileUrl);
        if (publicId) {
          // Delete from Cloudinary
          if (media.type === 'video') {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
          } else if (media.type === 'document') {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
          } else {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
          }
        }
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete thumbnail from Cloudinary if exists
    if (media.thumbnail && media.thumbnail.includes('cloudinary.com')) {
      try {
        const urlParts = media.thumbnail.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExt.split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        console.log('Deleted thumbnail from Cloudinary:', publicId);
      } catch (error) {
        console.error('Error deleting thumbnail:', error);
      }
    }

    // Delete from MongoDB
    await Media.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Error deleting media', error: error.message });
  }
};