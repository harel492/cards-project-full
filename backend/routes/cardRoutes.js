const express = require('express');
const {
  getAllCards,
  getMyCards,
  getCardById,
  getCardsByUser,
  createCard,
  updateCard,
  likeCard,
  deleteCard,
  updateBizNumber
} = require('../controllers/cardController');

const { protect, businessOrAdmin, adminOnly } = require('../middleware/authMiddleware');
const {
  validate,
  createCardSchema,
  updateCardSchema,
  updateBizNumberSchema
} = require('../validation/schemas');

const router = express.Router();

router.get('/', getAllCards);

router.get('/my-cards', protect, getMyCards);

router.get('/user/:userId', getCardsByUser);

router.get('/:id', getCardById);

router.post('/', protect, businessOrAdmin, validate(createCardSchema), createCard);

router.put('/:id', protect, validate(updateCardSchema), updateCard);

router.patch('/:id', protect, likeCard);

router.delete('/:id', protect, deleteCard);

router.patch('/:id/biz-number', protect, adminOnly, validate(updateBizNumberSchema), updateBizNumber);

module.exports = router