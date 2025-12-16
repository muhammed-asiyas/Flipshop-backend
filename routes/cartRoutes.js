const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');


router.get('/', auth.optional, cartController.getCart);
router.post('/add', auth.optional, cartController.addToCart);
router.put('/update/:itemId', auth.optional, cartController.updateQty);
router.delete('/remove/:itemId', auth.optional, cartController.removeItem);
router.delete('/clear', auth.optional, cartController.clearCart);

module.exports = router;