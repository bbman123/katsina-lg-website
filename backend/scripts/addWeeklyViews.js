const mongoose = require('mongoose');
const Media = require('../models/Media');
require('dotenv').config();

async function addWeeklyViews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Update all media items that don't have weeklyViews
    const result = await Media.updateMany(
      { weeklyViews: { $exists: false } },
      { 
        $set: { 
          weeklyViews: 0,
          lastViewReset: new Date(),
          viewDetails: []
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} media items`);
    
    // Also set weeklyViews to current views for initial trending
    const allMedia = await Media.find({});
    for (const item of allMedia) {
      if (item.views > 0) {
        item.weeklyViews = Math.floor(item.views * 0.3); // Start with 30% of total views
        await item.save();
      }
    }
    
    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addWeeklyViews();