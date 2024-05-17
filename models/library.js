const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({ 
  title: {
    type: String,
    default: '',
  },
  commentcount: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: String
    }
  ],
});

const Library = mongoose.model('Library', librarySchema);

module.exports = Library;