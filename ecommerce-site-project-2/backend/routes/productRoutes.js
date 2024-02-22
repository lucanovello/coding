import express from 'express';
import Devices from '../models/devicesModel.js';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/all', async (req, res) => {
  const products = await Product.find();
  const artist = await Product.distinct('artist');
  const category = await Product.distinct('category');
  const nationality = await Product.distinct('nationality');

  console.log('/product');
  res.send({ products, artist, category, nationality });
});

productRouter.get(`/:slug`, async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  const devices = await Devices.find();
  try {
    res.send({
      product,
      devices,
    });
    console.log(`/products/:${req.params.slug}`);
  } catch (error) {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
