const mongoose = require('mongoose');
const Media = require('../models/Media');
require('dotenv').config();

async function resetWeeklyViews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Reset all weekly views
    const result = await Media.updateMany(
      {},
      { 
        $set: { 
          weeklyViews: 0,
          lastViewReset: new Date()
        }
      }
    );
    
    console.log(`Reset weekly views for ${result.modifiedCount} media items`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting weekly views:', error);
    process.exit(1);
  }
}

resetWeeklyViews();