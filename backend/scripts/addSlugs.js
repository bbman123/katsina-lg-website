const mongoose = require('mongoose');
const Media = require('../models/Media');
require('dotenv').config();

async function addSlugsToExistingMedia() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const mediaItems = await Media.find({ slug: { $exists: false } });
    console.log(`Found ${mediaItems.length} items without slugs`);
    
    for (const item of mediaItems) {
      // Generate slug
      let baseSlug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
      
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure uniqueness
      while (await Media.findOne({ slug, _id: { $ne: item._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      item.slug = slug;
      await item.save();
      console.log(`Added slug "${slug}" for "${item.title}"`);
    }
    
    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addSlugsToExistingMedia();