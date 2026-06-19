// Run: node seedTestUsers.js
// Creates demo test user accounts

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const TEST_USERS = [
  {
    name: 'Ramesh Kumar',
    email: 'farmer@test.com',
    password: 'Farmer@123',
    role: 'farmer'
  },
  {
    name: 'Suresh Buyer',
    email: 'buyer@test.com',
    password: 'Buyer@1234',
    role: 'buyer'
  },
  {
    name: 'Driver Demo',
    email: 'driver@test.com',
    password: 'Driver@123',
    role: 'farmer' // Driver users are still farmers who register for transport
  },
  {
    name: 'Storage Owner',
    email: 'storage@test.com',
    password: 'Storage@123',
    role: 'storage_owner'
  }
];

const seedTestUsers = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agriconnect';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    for (const userData of TEST_USERS) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`✓ User exists: ${userData.email} (${userData.role})`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      console.log(`✓ Created: ${userData.email}`);
      console.log(`  Name: ${userData.name}`);
      console.log(`  Password: ${userData.password}`);
      console.log(`  Role: ${userData.role}\n`);
    }

    console.log('\n========== DEMO LOGIN CREDENTIALS ==========');
    console.log('\n📋 Admin Login:');
    console.log('   Email: admin@agriconnect.com');
    console.log('   Password: Admin@1234\n');
    
    console.log('👨‍🌾 Farmer Login:');
    console.log('   Email: farmer@test.com');
    console.log('   Password: Farmer@123\n');
    
    console.log('🛒 Buyer Login:');
    console.log('   Email: buyer@test.com');
    console.log('   Password: Buyer@1234\n');
    
    console.log('🚗 Driver Login:');
    console.log('   Email: driver@test.com');
    console.log('   Password: Driver@123\n');
    
    console.log('🏪 Storage Owner Login:');
    console.log('   Email: storage@test.com');
    console.log('   Password: Storage@123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding test users:', error.message);
    process.exit(1);
  }
};

seedTestUsers();
