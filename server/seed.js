require('dotenv').config();
const mongoose = require('mongoose');
const Character = require('./models/Character');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Characters to insert
const characters = [
  { name: 'Mario', votes: 0 },
  { name: 'Pikachu', votes: 0 },
  { name: 'Sonic', votes: 0 },
  { name: 'Kirby', votes: 0 }
];

// Insert characters and close connection
Character.insertMany(characters)
  .then(() => {
    console.log('✅ Characters inserted successfully!');
    mongoose.connection.close();
  })
  .catch(err => console.error('❌ Error inserting characters:', err));
