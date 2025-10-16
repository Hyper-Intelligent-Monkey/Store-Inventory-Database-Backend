const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB(){
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI missing');
    await mongoose.connect(uri);
    console.log('✅ Mongo Connected');
}

module.exports = {connectDB};