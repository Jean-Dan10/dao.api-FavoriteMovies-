const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  id: Number,
  genre_ids: [Number],
  backdrop_path: String,
  popularity: Number,
  poster_path: String,
  title: String,
});

const userSchema = new mongoose.Schema(
  {
    
    timestamp: {type:String, require:true} ,
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    movies: [movieSchema],
  },
  { collection: "UserFavoriteMovies" }
);

const User = mongoose.model("UserFavoriteMovies", userSchema);

module.exports = User;
