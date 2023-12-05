const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Định nghĩa các tuyến đường cho productController
router.get('/products', productController.list);
router.get('/products/create', productController.createForm);
router.post('/products/create', productController.create);
router.get('/products/:id', productController.detail);
router.get('/products/:id/update', productController.updateForm);
router.post('/products/:id/update', productController.update);
router.post('/products/:id/delete', productController.delete);
module.exports = router;
