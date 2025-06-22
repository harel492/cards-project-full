const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');
const { asyncHandler, createError, sendResponse } = require('../utils/errorUtils');

const registerUser = asyncHandler(async (req, res, next) => {
 const { name, phone, email, password, image, address, isBusiness } = req.body;

 const existingUser = await User.findOne({ email });
 if (existingUser) {
   return next(createError('User with this email already exists', 400));
 }

 const user = await User.create({
   name,
   phone,
   email,
   password,
   image,
   address,
   isBusiness: isBusiness || false
 });

 const token = generateToken({
   _id: user._id,
   isBusiness: user.isBusiness,
   isAdmin: user.isAdmin
 });

 sendResponse(res, 201, {
   user,
   token
 }, 'User registered successfully');
});

const loginUser = asyncHandler(async (req, res, next) => {
 const { email, password } = req.body;

 const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
 
 if (!user) {
   return next(createError('Invalid email or password', 401));
 }

 try {
   const isMatch = await user.matchPassword(password);
   
   if (!isMatch) {
     return next(createError('Invalid email or password', 401));
   }

   const token = generateToken({
     _id: user._id,
     isBusiness: user.isBusiness,
     isAdmin: user.isAdmin
   });

   const userResponse = user.toJSON();

   sendResponse(res, 200, {
     user: userResponse,
     token
   }, 'Login successful');

 } catch (error) {
   if (error.message.includes('locked')) {
     return next(createError(error.message, 423));
   }
   return next(error);
 }
});

const getAllUsers = asyncHandler(async (req, res, next) => {
 const users = await User.find({}).select('-password -loginAttempts -lockUntil');
 
 sendResponse(res, 200, {
   users,
   count: users.length
 }, 'Users retrieved successfully');
});

const getUserById = asyncHandler(async (req, res, next) => {
 const user = await User.findById(req.params.id);
 
 if (!user) {
   return next(createError('User not found', 404));
 }

 sendResponse(res, 200, { user }, 'User retrieved successfully');
});

const getMe = asyncHandler(async (req, res, next) => {
 const user = await User.findById(req.user._id);
 
 if (!user) {
   return next(createError('User not found', 404));
 }

 sendResponse(res, 200, { user }, 'Current user retrieved successfully');
});

const updateUser = asyncHandler(async (req, res, next) => {
 const { id } = req.params;

 let user = await User.findById(id);
 if (!user) {
   return next(createError('User not found', 404));
 }

 if (req.body.email && req.body.email !== user.email) {
   const existingUser = await User.findOne({ email: req.body.email });
   if (existingUser) {
     return next(createError('Email already in use', 400));
   }
 }

 user = await User.findByIdAndUpdate(
   id,
   { $set: req.body },
   { new: true, runValidators: true }
 );

 sendResponse(res, 200, { user }, 'User updated successfully');
});

const changeUserStatus = asyncHandler(async (req, res, next) => {
 const { id } = req.params;
 const { isBusiness } = req.body;

 const user = await User.findById(id);
 if (!user) {
   return next(createError('User not found', 404));
 }

 user.isBusiness = isBusiness;
 await user.save();

 sendResponse(res, 200, { user }, `User status changed to ${isBusiness ? 'business' : 'regular'} successfully`);
});

const deleteUser = asyncHandler(async (req, res, next) => {
 const { id } = req.params;

 const user = await User.findById(id);
 if (!user) {
   return next(createError('User not found', 404));
 }

 if (user.isAdmin && req.user._id.toString() === id) {
   return next(createError('Admin cannot delete their own account', 400));
 }

 await User.findByIdAndDelete(id);

 sendResponse(res, 200, null, 'User deleted successfully');
});

const changePassword = asyncHandler(async (req, res, next) => {
 const { id } = req.params;
 const { currentPassword, newPassword } = req.body;

 if (!currentPassword || !newPassword) {
   return next(createError('Current password and new password are required', 400));
 }

 if (newPassword.length < 8) {
   return next(createError('New password must be at least 8 characters long', 400));
 }

 const user = await User.findById(id).select('+password');
 
 if (!user) {
   return next(createError('User not found', 404));
 }

 if (req.user._id.toString() !== id && !req.user.isAdmin) {
   return next(createError('Access denied. You can only change your own password', 403));
 }

 const isCurrentPasswordCorrect = await user.matchPassword(currentPassword);
 
 if (!isCurrentPasswordCorrect) {
   return next(createError('Current password is incorrect', 400));
 }

 user.password = newPassword;
 await user.save();

 sendResponse(res, 200, null, 'Password changed successfully');
});

module.exports = {
 registerUser,
 loginUser,
 getAllUsers,
 getUserById,
 getMe,
 updateUser,
 changeUserStatus,
 deleteUser,
 changePassword 
};