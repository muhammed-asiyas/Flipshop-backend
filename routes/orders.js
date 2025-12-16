const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {createOrder, getOrderById} = require('../controllers/orderController')

router.post('/', createOrder);
router.get('/:id', getOrderById);


module.exports = router;