const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).limit(20);
        res.json(products);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

exports.getProductByAsin = async (req, res) => {
    try {
        const product = await Product.findOne({ asin: req.params.asin });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};