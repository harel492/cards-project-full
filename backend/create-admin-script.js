const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// This script shows how to create an admin user
// Run this AFTER MongoDB is connected and you have a user

async function createAdminUser() {
  try {
    // Connect to MongoDB using the same connection string as the backend
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bcard';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    const User = require('./models/User');

    // Option 1: Create a new admin user
    const adminData = {
      name: {
        first: 'Admin',
        last: 'User'
      },
      phone: '050-1234567',
      email: 'admin@bcard.com',
      password: 'Admin123!@#',
      address: {
        country: 'ישראל',
        city: 'תל-אביב',
        street: 'רחוב הראשי',
        houseNumber: 1
      },
      isBusiness: true,
      isAdmin: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Is Admin:', existingAdmin.isAdmin);
      return;
    }

    // Create admin user
    const adminUser = await User.create(adminData);
    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminData.password);
    console.log('Is Admin:', adminUser.isAdmin);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

// Option 2: Update existing user to admin
async function makeUserAdmin(email) {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bcard';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    const User = require('./models/User');

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found with email:', email);
      return;
    }

    user.isAdmin = true;
    await user.save();

    console.log('✅ User updated to admin successfully!');
    console.log('Email:', user.email);
    console.log('Is Admin:', user.isAdmin);

  } catch (error) {
    console.error('❌ Error updating user:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

// Check existing users
async function checkUsers() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bcard';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    const User = require('./models/User');
    
    console.log('🔍 Checking existing users...');
    
    const users = await User.find({}).select('name email isBusiness isAdmin createdAt');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log(`✅ Found ${users.length} user(s):`);
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name.first} ${user.name.last}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Business: ${user.isBusiness ? 'Yes' : 'No'}`);
        console.log(`   Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      });
    }
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

// Instructions
console.log('📋 Instructions to create admin user:');
console.log('');
console.log('1. MongoDB Atlas is already configured');
console.log('2. Run one of these commands:');
console.log('');
console.log('   To check existing users:');
console.log('   node -e "require(\'./create-admin-script.js\').checkUsers()"');
console.log('');
console.log('   To create a new admin user:');
console.log('   node -e "require(\'./create-admin-script.js\').createAdminUser()"');
console.log('');
console.log('   To make existing user admin (replace email):');
console.log('   node -e "require(\'./create-admin-script.js\').makeUserAdmin(\'user@example.com\')"');
console.log('');
console.log('3. Login with the admin credentials in the app');
console.log('');

module.exports = {
  createAdminUser,
  makeUserAdmin,
  checkUsers
}; 