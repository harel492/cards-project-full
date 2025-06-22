const Card = require('../models/Card');
const { asyncHandler, createError, sendResponse } = require('../utils/errorUtils');


const getAllCards = asyncHandler(async (req, res, next) => {
 const { search } = req.query;
 
 let query = {};
 

 if (search) {
   query = {
     $or: [
       { title: { $regex: search, $options: 'i' } },
       { subtitle: { $regex: search, $options: 'i' } },
       { description: { $regex: search, $options: 'i' } }
     ]
   };
 }

 const cards = await Card.find(query)
   .populate('user_id', 'name email')
   .sort({ createdAt: -1 });

 sendResponse(res, 200, {
   cards,
   count: cards.length
 }, 'Cards retrieved successfully');
});


const getMyCards = asyncHandler(async (req, res, next) => {
 const cards = await Card.find({ user_id: req.user._id })
   .populate('user_id', 'name email')
   .sort({ createdAt: -1 });

 sendResponse(res, 200, {
   cards,
   count: cards.length
 }, 'Your cards retrieved successfully');
});

const getCardsByUser = asyncHandler(async (req, res, next) => {
 const { userId } = req.params;
 
 const cards = await Card.find({ user_id: userId })
   .populate('user_id', 'name email')
   .sort({ createdAt: -1 });

 sendResponse(res, 200, cards, 'User cards retrieved successfully');
});


const getCardById = asyncHandler(async (req, res, next) => {
 const card = await Card.findById(req.params.id)
   .populate('user_id', 'name email phone')
   .populate('likes', 'name email');

 if (!card) {
   return next(createError('Card not found', 404));
 }

 sendResponse(res, 200, { card }, 'Card retrieved successfully');
});


const createCard = asyncHandler(async (req, res, next) => {
 const cardData = {
   ...req.body,
   user_id: req.user._id
 };

 cardData.bizNumber = await Card.generateBizNumber();

 const card = await Card.create(cardData);
 
 await card.populate('user_id', 'name email');

 sendResponse(res, 201, { card }, 'Card created successfully');
});

const updateCard = asyncHandler(async (req, res, next) => {
 const { id } = req.params;

 let card = await Card.findById(id);
 if (!card) {
   return next(createError('Card not found', 404));
 }

 if (card.user_id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
   return next(createError('Access denied. You can only edit your own cards', 403));
 }

 card = await Card.findByIdAndUpdate(
   id,
   { $set: req.body },
   { new: true, runValidators: true }
 ).populate('user_id', 'name email');

 sendResponse(res, 200, { card }, 'Card updated successfully');
});


const likeCard = asyncHandler(async (req, res, next) => {
 const { id } = req.params;

 const card = await Card.findById(id);
 if (!card) {
   return next(createError('Card not found', 404));
 }


 const isLiked = card.toggleLike(req.user._id);
 await card.save();


 await card.populate('likes', 'name email');

 sendResponse(res, 200, {
   card,
   isLiked,
   likesCount: card.likesCount
 }, isLiked ? 'Card liked successfully' : 'Card unliked successfully');
});


const deleteCard = asyncHandler(async (req, res, next) => {
 const { id } = req.params;

 const card = await Card.findById(id);
 if (!card) {
   return next(createError('Card not found', 404));
 }


 if (card.user_id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
   return next(createError('Access denied. You can only delete your own cards', 403));
 }

 await Card.findByIdAndDelete(id);

 sendResponse(res, 200, null, 'Card deleted successfully');
});


const updateBizNumber = asyncHandler(async (req, res, next) => {
 const { id } = req.params;
 const { bizNumber } = req.body;


 const existingCard = await Card.findOne({ bizNumber, _id: { $ne: id } });
 if (existingCard) {
   return next(createError('Business number already in use', 400));
 }

 const card = await Card.findByIdAndUpdate(
   id,
   { bizNumber },
   { new: true, runValidators: true }
 ).populate('user_id', 'name email');

 if (!card) {
   return next(createError('Card not found', 404));
 }

 sendResponse(res, 200, { card }, 'Business number updated successfully');
});

module.exports = {
 getAllCards,
 getMyCards,
 getCardsByUser,
 getCardById,
 createCard,
 updateCard,
 likeCard,
 deleteCard,
 updateBizNumber
};