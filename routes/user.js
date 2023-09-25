const express = require("express");
const router = express.Router();
const userSchema = require("../models/user");
const APIResponse = require("../models/apiResponse");
const bcrypt = require("bcrypt");

require("dotenv").config();

const { route, response } = require("../app");
const User = require("../models/user");

router.post("/users", async (req, res) => {
  const {  username, password, timestamp } = req.body;
  const response = new APIResponse();
  const dateTime = new Date(timestamp);

  try {
    checkUser = await userSchema.findOne({ username: username });

    if (checkUser) {
      response.message = "Username already exists";
      return res.status(409).json(response);
    }

    const User = { username: username, password: password, timestamp: dateTime, movies: [] }
    const createdUser = await userSchema.create(User);

    response.user = User;
    console.log(response.user)

    response.message = "New user added";
    return res.status(201).json(response);

  } catch (error) {

    response.message = "Error adding user";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Supprimer un utilisateur
router.delete("/users/:username", async (req, res) => {
  const { username } = req.params;

  const response = new APIResponse();

  try {
    const userFound = await userSchema.findOne({ username: { $regex: new RegExp(username, "i") } });

    if (userFound == null) {

      response.message = "User not found";
      return res.status(404).json(response);
    } else {
      await userSchema.deleteOne({ username: { $regex: new RegExp(username, "i") } });

      response.message = "User deleted";
      response.user = userFound;

      return res.status(200).json(response);
    }
  } catch (error) {

    response.message = "Error deleting user";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Trouver utilisateur
router.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  const response = new APIResponse();

  try {
    const userFound = await userSchema.findOne({ username: { $regex: new RegExp(username, "i") } });

    if (userFound == null) {

      response.message = "User not found";
      return res.status(404).json(response);
    } else {

      response.user = userFound;
      return res.status(200).json(response);
    }
  } catch (error) {

    response.message = "Error searching for user";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Trouver la liste de TOUS utilisateurs
router.get("/users", async (req, res) => {
  const response = new APIResponse();
  try {
    response.userList = await userSchema.find();


    return res.status(200).json(response);
  } catch (error) {

    response.message = "Error in the search of all users";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Trouver la liste de film d'un utilisateur
router.get("/users/:username/movies", async (req, res) => {
  const { username } = req.params;
  const response = new APIResponse();

  try {
    const userFound = await userSchema.findOne({ username: { $regex: new RegExp(username, "i") } });

    if (userFound == null) {

      response.message = "User not found";
      return res.status(404).json(response);
    }

    const favoriteList = userFound.movies;

    if (!favoriteList || favoriteList.length == 0) {

      response.message = "No movies found";
      return res.status(404).json(response);
    }


    response.movieList = favoriteList;
    res.status(200).json(response);
  } catch (error) {

    response.message = "Error searching for the list of movie ";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Ajouter un film dans la liste de film d'un utilisateur
router.post("/users/:username/movies", async (req, res) => {
  const { username } = req.params;
  const movie = req.body

  const response = new APIResponse();

  try {
    userFound = await userSchema.findOne({ username: { $regex: new RegExp(username, "i") } });

    if (userFound == null) {
      response.message = "User not found";
      return res.status(404).json(response);
    }
    
    userFound.movies.push(movie);
    response.message = "movie added";
    response.movie = movie;
    await userFound.save();

    return res.status(200).json(response);
  } catch (error) {

    response.message = "Error when adding favorite movie";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Retirer un film de la liste de films d'un utilisateur
router.delete("/users/:username/movies/:movieId", async (req, res) => {
  const { username } = req.params;
  const { movieId } = req.params;

  const response = new APIResponse();

  try {
    const user = await User.findOneAndUpdate(
      { username: { $regex: new RegExp(username, "i") } },
      {
        $pull: { movies: { id: Number(movieId) } },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    response.movieList = user.movies;
    response.message = "The movie has been successfully removed. ";

    return res.status(200).json(response);
  } catch (error) {

    response.message = "Error when removing favorite movie";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//vider la liste de films d'un utilisater
router.delete("/users/:username/movies", async (req, res) => {
  const { username } = req.params;
  const response = new APIResponse();

  try {
    const userFound = await userSchema.findOne({ username: { $regex: new RegExp(username, "i") } });

    if (userFound == null) {

      response.message = "User not found";
      return res.status(404).json(response);
    }

    userFound.movies = [];
    await userFound.save();


    response.message = "Clearing of user favorite movies complete";
    return res.status(200).json(response);
  } catch (error) {

    response.message = "Error while clearing favorite movies";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

router.get("/users/login", async (req, res) => {
  // comparaison du hash

  return render("")
});


function errorResponse(res, message, statusCode = 500, error = null) {
  const response = {

    message: message,
  };

  if (error) {
    response.error = error.message;
  }

  return res.status(statusCode).json(response);
}

module.exports = router;
