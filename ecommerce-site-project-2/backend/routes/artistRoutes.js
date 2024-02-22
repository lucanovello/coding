import express from 'express';
import Product from '../models/productModel.js';

const artistRouter = express.Router();

artistRouter.get('/', async (req, res) => {
  const artist = await Product.distinct('artist');

  console.log('/artists');
  res.send({ artist });
});

artistRouter.get(`/:artist`, async (req, res) => {
  const artistLink = req.params.artist.replace('_', ' ');
  const artist = await Product.find({ artist: artistLink });
  console.log('/:artist');
  res.send({
    artist,
  });
});

export default artistRouter;
