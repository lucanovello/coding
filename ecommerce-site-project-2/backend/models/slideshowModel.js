import mongoose from 'mongoose';

const slideshowSchema = new mongoose.Schema({
  image: { type: String, required: true },
  alt: { type: String, required: true },
});

const Slideshow = mongoose.model('Slideshow', slideshowSchema);
export default Slideshow;
