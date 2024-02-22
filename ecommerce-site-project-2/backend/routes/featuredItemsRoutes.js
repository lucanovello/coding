import express from 'express';
import Product from '../models/productModel.js';

const featuredItemsRouter = express.Router();
const itemCount = 7;

featuredItemsRouter.get('/', async (req, res) => {
  const products = await Product.find({ isfeatured: true });
  const featuredItems = [];
  const arr = [];
  while (
    products.length < itemCount
      ? featuredItems.length < products.length
      : featuredItems.length < itemCount
  ) {
    let randInt = Math.floor(Math.random() * products.length);
    if (arr.indexOf(randInt) === -1) {
      arr.push(randInt);
      featuredItems.push(products[randInt]);
    }
  }
  console.log('/featuredItems');
  res.send({ featuredItems });
});

featuredItemsRouter.get('/artist', async (req, res) => {
  const products = await Product.find({ artist: req.query.content });
  const featuredItems = [];
  const arr = [];
  while (
    products.length < itemCount
      ? featuredItems.length < products.length
      : featuredItems.length < itemCount
  ) {
    let randInt = Math.floor(Math.random() * products.length);
    if (arr.indexOf(randInt) === -1) {
      arr.push(randInt);
      featuredItems.push(products[randInt]);
    }
  }
  console.log(`featuredItems/${req.query.content}`);
  res.send({ featuredItems });
});

featuredItemsRouter.get('/category', async (req, res) => {
  const products = await Product.find({ category: req.query.content });
  const featuredItems = [];
  const arr = [];
  while (
    products.length < itemCount
      ? featuredItems.length < products.length
      : featuredItems.length < itemCount
  ) {
    let randInt = Math.floor(Math.random() * products.length);
    if (arr.indexOf(randInt) === -1) {
      arr.push(randInt);
      featuredItems.push(products[randInt]);
    }
  }
  console.log(`featuredItems/${req.query.content}`);
  res.send({ featuredItems });
});

featuredItemsRouter.get('/year', async (req, res) => {
  const products = await Product.find({
    year: {
      $gte: Math.floor(req.query.content / 100) * 100,
      $lte: Math.ceil(req.query.content / 100) * 100,
    },
  });
  const featuredItems = [];
  const arr = [];
  while (
    products.length < itemCount
      ? featuredItems.length < products.length
      : featuredItems.length < itemCount
  ) {
    let randInt = Math.floor(Math.random() * products.length);
    if (arr.indexOf(randInt) === -1) {
      arr.push(randInt);
      featuredItems.push(products[randInt]);
    }
  }
  console.log(`featuredItems/${req.query.content}`);
  res.send({ featuredItems });
});

export default featuredItemsRouter;
