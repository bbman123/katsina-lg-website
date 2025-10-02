const cron = require('node-cron');
const Media = require('../models/Media');

// Run every Monday at 00:00
const setupCronJobs = () => {
  cron.schedule('0 0 * * 1', async () => {
    try {
      console.log('Running weekly views reset...');
      
      await Media.updateMany(
        {},
        { 
          $set: { 
            weeklyViews: 0,
            lastViewReset: new Date()
          }
        }
      );
      
      console.log('Weekly views reset completed');
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
  
  console.log('Cron jobs initialized');
};

module.exports = setupCronJobs;