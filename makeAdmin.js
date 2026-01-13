const mongoose = require('mongoose');

// Load .env from server directory (same folder as this script)
require('dotenv').config();

// Simple User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function makeAdmin() {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

        if (!mongoUri) {
            console.error('❌ ERROR: MongoDB URI not found in .env file');
            console.log('\nChecking for: MONGO_URI or MONGODB_URI');
            console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
            process.exit(1);
        }

        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Update the user
        const result = await User.updateOne(
            { email: "xstreetmafia@gmail.com" },
            { $set: { role: "admin" } }
        );

        if (result.modifiedCount > 0) {
            console.log('\n✅ SUCCESS! User xstreetmafia@gmail.com is now an ADMIN!');
            console.log('\nNext steps:');
            console.log('1. Logout from your app');
            console.log('2. Login with xstreetmafia@gmail.com');
            console.log('3. Look for "🔐 Admin Panel" in the sidebar\n');
        } else if (result.matchedCount > 0) {
            console.log('\n✅ User already has admin role!');
        } else {
            console.log('\n❌ User not found. Please check the email address.');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

makeAdmin();
