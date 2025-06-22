const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg'
  },
  alt: {
    type: String,
    default: 'Business card image'
  }
});

const AddressSchema = new mongoose.Schema({
  state: {
    type: String,
    maxlength: [50, 'State cannot exceed 50 characters'],
    trim: true,
    default: ''
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    minlength: [2, 'Country must be at least 2 characters'],
    maxlength: [50, 'Country cannot exceed 50 characters'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    minlength: [2, 'City must be at least 2 characters'],
    maxlength: [50, 'City cannot exceed 50 characters'],
    trim: true
  },
  street: {
    type: String,
    required: [true, 'Street is required'],
    minlength: [2, 'Street must be at least 2 characters'],
    maxlength: [100, 'Street cannot exceed 100 characters'],
    trim: true
  },
  houseNumber: {
    type: Number,
    required: [true, 'House number is required'],
    min: [1, 'House number must be at least 1']
  },
  zip: {
    type: String,
    maxlength: [20, 'ZIP code cannot exceed 20 characters'],
    trim: true,
    default: ''
  }
});

const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [2, 'Title must be at least 2 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    trim: true
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
    minlength: [2, 'Subtitle must be at least 2 characters'],
    maxlength: [100, 'Subtitle cannot exceed 100 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [2, 'Description must be at least 2 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^0[2-9]\d{7,8}$/, 'Please enter a valid Israeli phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  web: {
    type: String,
    default: '',
    match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please enter a valid website URL']
  },
  image: {
    type: ImageSchema,
    default: () => ({})
  },
  address: {
    type: AddressSchema,
    required: true
  },
  bizNumber: {
    type: Number,
    required: true,
    unique: true,
    min: [1000000, 'Business number must be at least 7 digits'],
    max: [9999999, 'Business number cannot exceed 7 digits']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


CardSchema.index({ title: 'text', subtitle: 'text', description: 'text' });
CardSchema.index({ bizNumber: 1 });
CardSchema.index({ user_id: 1 });
CardSchema.index({ createdAt: 1 });
CardSchema.index({ likes: 1 });


CardSchema.statics.generateBizNumber = async function() {
  let bizNumber;
  let exists = true;
  
  while (exists) {
    bizNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
    exists = await this.findOne({ bizNumber });
  }
  
  return bizNumber;
};


CardSchema.methods.toggleLike = function(userId) {
  const userIdString = userId.toString();
  const likeIndex = this.likes.findIndex(like => like.toString() === userIdString);
  
  if (likeIndex === -1) {
   
    this.likes.push(userId);
    return true; 
  } else {
   
    this.likes.splice(likeIndex, 1);
    return false; 
  }
};


CardSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.toString() === userId.toString());
};


CardSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});


CardSchema.set('toJSON', { virtuals: true });

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;