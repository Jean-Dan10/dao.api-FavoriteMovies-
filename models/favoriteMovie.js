const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: Number,
  genreIds: [Number],
  backdropPath: String,
  popularity: Number,
  posterPath: String,
  title: String
  
});


const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String, 
  movies: [movieSchema],
},{ collection: 'UserFavoriteMovies' }); 

const User = mongoose.model('UserFavoriteMovies', userSchema);

module.exports = User;

