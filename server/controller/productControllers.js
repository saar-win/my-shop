const res = require("express/lib/response");
const Categories = require("../models/Categories");
const Product = require("../models/Product");
const logger = require('../utils/logger');
const { ObjectId } = require("bson");

require('../utils/validators.js')();

const validateCategories = async (query) => {
  if (query) {
    const categories = await Categories.find({});
    let validation = categories.map(v => v.name);
    if (validation.includes(query)) return true;
  }
  return false;
};

const getAllProducts = async (req, res) => {
  try {
    let category = req.query.category;
    let products = [];
    if (await validateCategories(category))
      products = await Product.find({ type: req.query.category });
    else products = await Product.find({});
    logger.info("GET /api/products request has been accepted");
    res.json(products);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server Error!" });
  }
};

const getProductById = async (req, res) => {
  let _id = null;
  try {
    _id = ObjectId(req.params.id);
  } catch (e) {
    return res.status(400).json({ error: "invalid id!" });
  }
  try {
    const products = await Product.findById(_id);
    res.status(200).json(products);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ message: "Server Error!" });
  }
};

// const addProduct = async (req, res) => {
//   try {
//     const { error } = validateProduct(req.body);
//     if (error) {
//       logger.error(error);
//       res.status(400).send({ status: 400, error});
//       return;
//     }
//     logger.info(`POST /api/products/ request has been accepted`);
//     await Product.create(req.body);
//     res.json({ status: 200, info: "product added successfuly!", product: req.body })
//   } catch (e) {
//     logger.error(e);
//     res.status(500).json({ message: "Server Error!" });
//   }
// }

// const setProductById = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const { error } = validateProduct(req.body);
//     if (error) {
//       logger.error(error);
//       res.status(400).send({ status: 400, error });
//       return;
//     }
//     logger.info(`PUT /api/products/${_id} request has been accepted`);
//     await Product.findByIdAndUpdate({_id}, req.body);
//     res.json({ status: 200, info: "product updated successfuly!", product: req.body })
//   } catch (e) {
//     logger.error(e);
//     res.status(500).json({ message: "Server Error!" });
//   }
// }

const removeProductById = async (req, res) => {
  try {
    const _id = req.params.id;
    const product = await Product.findByIdAndDelete({_id});
    if (product) {
      res.status(200).json({ info: "product deleted successfuly!" })
      return;
    }
    logger.error("product not exsits!");
    res.status(400).json({ error: "product not exsits!" })
  } catch (e) {
    logger.error(e);
    res.status(500).json({ message: "Server Error!" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  // addProduct,
  // setProductById,
  removeProductById
}