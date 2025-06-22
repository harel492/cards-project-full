const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const NameSchema = new mongoose.Schema({
  first: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters'],
    trim: true
  },
  middle: {
    type: String,
    maxlength: [50, 'Middle name cannot exceed 50 characters'],
    trim: true,
    default: ''
  },
  last: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    trim: true
  }
});

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png'
  },
  alt: {
    type: String,
    default: 'User profile image'
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

const UserSchema = new mongoose.Schema({
  name: {
    type: NameSchema,
    required: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^0[2-9]\d{7,8}$/, 'Please enter a valid Israeli phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  image: {
    type: ImageSchema,
    default: () => ({})
  },
  address: {
    type: AddressSchema,
    required: true
  },
  isBusiness: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
 
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});


UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: 1 });


UserSchema.pre('save', async function(next) {
  
  if (!this.isModified('password')) return next();

  try {
    
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (this.isLocked) {
    throw new Error('Account is temporarily locked due to too many failed login attempts');
  }
  
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  
 
  if (!isMatch) {
    this.loginAttempts += 1;
    
 
    if (this.loginAttempts >= (parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 3)) {
      this.lockUntil = Date.now() + (parseInt(process.env.LOCK_TIME) || 24) * 60 * 60 * 1000; // 24 hours
    }
    
    await this.save();
    return false;
  }
  

  if (this.loginAttempts > 0) {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    await this.save();
  }
  
  return true;
};


UserSchema.methods.getDisplayName = function() {
  return `${this.name.first} ${this.name.last}`;
};


UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;