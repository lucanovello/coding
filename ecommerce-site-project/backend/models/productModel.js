import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    artist: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: Number, required: true },
    nationality: { type: String, required: true },
    category: { type: String, required: true },
    sales: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    isfeatured: { type: Boolean, required: false },
    image2: { type: String, required: false },
    image3: { type: String, required: false },
    tags: { type: String, required: false },
    rating: { type: Number, required: false },
    numReviews: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
