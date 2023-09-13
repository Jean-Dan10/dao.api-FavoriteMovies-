const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String, 
  movies: [
    {
      id: Number,
      genreIds: [Number],
      backdropPath: String,
      popularity: Number,
      posterPath: String,
      title: String,
    },
  ],
},{ collection: 'UserFavoriteMovies' }); 

const User = mongoose.model('UserFavoriteMovies', userSchema);

module.exports = User;

user
userList
movie
movieList
success
message 

