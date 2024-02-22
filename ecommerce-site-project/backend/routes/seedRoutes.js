import express from 'express';
import data from '../dataAll.js';
import Artists from '../models/artistModel.js';
import Categories from '../models/categoryModel.js';
import Devices from '../models/devicesModel.js';
import Product from '../models/productModel.js';
import Slideshow from '../models/slideshowModel.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/insert', async (req, res) => {
    await Product.deleteMany({});
    await Slideshow.deleteMany({});
    await Devices.deleteMany({});
    await Categories.deleteMany({});
    await Artists.deleteMany({});

    const products = await Product.insertMany(data.products);
    const slideshow = await Slideshow.insertMany(data.slideshow);
    const devices = await Devices.insertMany(data.devices);
    const categories = await Categories.insertMany(data.categories);
    const artists = await Artists.insertMany(data.artists);
    console.log('/insert');
    res.send({
        products,
        slideshow,
        devices,
        categories,
        artists,
    });
});
seedRouter.get('/all', async (req, res) => {
    const products = await Product.find();
    const slideshow = await Slideshow.find();
    const devices = await Devices.find();

    console.log('/all');
    res.send({
        products,
        slideshow,
        devices,
        // createdUsers,
    });
});
seedRouter.get('/products', async (req, res) => {
    const products = await Product.find();
    console.log('/products');
    res.send({
        products,
    });
});
seedRouter.get('/slideshow', async (req, res) => {
    const slideshow = await Slideshow.find();
    console.log('/slideshow');
    res.send({
        slideshow,
    });
});
seedRouter.get('/devices', async (req, res) => {
    const devices = await Devices.find();
    console.log('/devices');
    res.send({
        devices,
    });
});
seedRouter.get('/createdUsers', async (req, res) => {
    const createdUsers = await User.find();
    console.log('/createdUsers');
    res.send({
        createdUsers,
    });
});

export default seedRouter;
