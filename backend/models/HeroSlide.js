// // models/HeroSlide.js
// const heroSlideSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   subtitle: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String, required: true }, // Cloudinary URL
//   order: { type: Number, default: 0 },
//   stats: [{
//     label: { type: String, required: true },   // e.g., "Hospitals"
//     value: { type: Number, required: true },   // e.g., 12
//     format: { 
//       type: String, 
//       enum: ['number', 'k', 'm'], 
//       default: 'number' 
//     } // optional formatting hint
//   }]
// }, { timestamps: true });

// module.exports = mongoose.model('HeroSlide', heroSlideSchema);