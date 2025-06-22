const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getMe,
  updateUser,
  changeUserStatus,
  changePassword,
  deleteUser
} = require('../controllers/userController');

const { protect, adminOnly, ownerOrAdmin } = require('../middleware/authMiddleware');
const {
  validate,
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  changeUserStatusSchema
} = require('../validation/schemas');

const router = express.Router();

router.post('/', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginUserSchema), loginUser);
router.get('/me', protect, getMe);
router.get('/', protect, adminOnly, getAllUsers);

router.patch('/:id/password', protect, ownerOrAdmin, changePassword);

router.get('/:id', protect, ownerOrAdmin, getUserById);
router.put('/:id', protect, ownerOrAdmin, validate(updateUserSchema), updateUser);
router.patch('/:id', protect, ownerOrAdmin, validate(changeUserStatusSchema), changeUserStatus);
router.delete('/:id', protect, ownerOrAdmin, deleteUser);

module.exports = router;