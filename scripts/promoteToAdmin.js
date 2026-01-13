// Run this script from the server directory: node scripts/promoteToAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function promoteToAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Enter email of user to promote to admin: ', async (email) => {
            try {
                const user = await User.findOne({ email: email.trim() });

                if (user) {
                    user.role = 'admin';
                    await user.save();
                    console.log(`\n✅ SUCCESS! User "${user.username}" (${email}) has been promoted to admin!\n`);
                } else {
                    console.log(`\n❌ ERROR: User with email "${email}" not found.\n`);
                    console.log('Available users:');
                    const allUsers = await User.find().select('email username role');
                    if (allUsers.length > 0) {
                        allUsers.forEach(u => {
                            console.log(`  - ${u.email} (${u.username}) - Role: ${u.role || 'user'}`);
                        });
                    } else {
                        console.log('  No users found. Please register a user first.');
                    }
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                readline.close();
                await mongoose.disconnect();
                process.exit();
            }
        });
    } catch (error) {
        console.error('❌ Connection Error:', error.message);
        process.exit(1);
    }
}

promoteToAdmin();
