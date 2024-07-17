import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

const getProductsHandler = asyncHandler(async (req, res) => {
  const limit = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keywordFilter = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keywordFilter });
  const products = await Product.find({ ...keywordFilter })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({ products, page, totalPages: Math.ceil(count / limit) });
});

const getProductByIdHandler = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

const createProductHandler = asyncHandler(async (req, res) => {
  const newProduct = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });

  const createdProduct = await newProduct.save();
  res.status(201).json(createdProduct);
});

const updateProductHandler = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const productToUpdate = await Product.findById(req.params.id);

  if (!productToUpdate) {
    res.status(404);
    throw new Error('Product not found');
  }

  productToUpdate.name = name;
  productToUpdate.price = price;
  productToUpdate.description = description;
  productToUpdate.image = image;
  productToUpdate.brand = brand;
  productToUpdate.category = category;
  productToUpdate.countInStock = countInStock;

  const updatedProduct = await productToUpdate.save();
  res.json(updatedProduct);
});

const deleteProductHandler = asyncHandler(async (req, res) => {
  const productToDelete = await Product.findById(req.params.id);

  if (!productToDelete) {
    res.status(404);
    throw new Error('Product not found');
  }

  await productToDelete.deleteOne();
  res.json({ message: 'Product removed' });
});

const createProductReviewHandler = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const newReview = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(newReview);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

const getTopProductsHandler = asyncHandler(async (req, res) => {
  const topProducts = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(topProducts);
});

export {
  getProductsHandler as getProducts,
  getProductByIdHandler as getProductById,
  createProductHandler as createProduct,
  updateProductHandler as updateProduct,
  deleteProductHandler as deleteProduct,
  createProductReviewHandler as createProductReview,
  getTopProductsHandler as getTopProducts,
};
