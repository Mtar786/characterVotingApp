const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  votes: { type: Number, default: 0 }
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
