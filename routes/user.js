const express = require("express");
const router = express.Router();
const userSchema = require("../models/favoriteMovie");
const APIResponse = require("../models/apiResponse");

const { route, response } = require("../app");
const User = require("../models/favoriteMovie");

//Ajouter un utilisateur
router.post("/users", async (req, res) => {
  const { User } = req.body;

  const response = new APIResponse();

  try {
    checkUser = await userSchema.findOne({ id: User.id });

    if (checkUser) {
      response.message = "User already exists";
      response.success = false;
      return res.status(409).json(response);
    }

    await userSchema.create(User);
    response.user = User;
    response.success = true;
    response.message = "New user added";
    return res.status(201).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error adding user";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Supprimer un utilisateur
router.delete("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const response = new APIResponse();

  try {
    const userFound = await userSchema.findOne({ id: userId });

    if (userFound == null) {
      response.success = false;
      response.message = "User not found";
      return res.status(404).json(response);
    } else {
      await userSchema.deleteOne({ id: userId });
      response.success = true;
      response.message = "User deleted";
      response.user = userFound;

      return res.status(200).json(response);
    }
  } catch (error) {
    response.success = false;
    response.message = "Error deleting user";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Trouver utilisateur
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const response = new APIResponse();

  try {
    const userFound = await userSchema.findOne({ id: userId });

    if (userFound == null) {
      response.success = false;
      response.message = "User not found";
      return res.status(404).json(response);
    } else {
      response.success = true;
      response.user = userFound;
      return res.status(200).json(response);
    }
  } catch (error) {
    response.success = false;
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

    response.success = true;
    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error in the search of all users";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Trouver la liste de film d'un utilisateur
router.get("/users/:userId/movies", async (req, res) => {
  const { userId } = req.params;
  const response = new APIResponse();

  try {
    const userFound = await userSchema.findOne({ id: userId });

    if (userFound == null) {
      response.success = false;
      response.message = "User not found";
      return res.status(404).json(response);
    }

    const favoriteList = userFound.movies;

    if (!favoriteList || favoriteList.length == 0) {
      response.success = false;
      response.message = "No movies found";
      return res.status(404).json(response);
    }

    response.success = true;
    response.movieList = favoriteList;
    res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error searching for the list of movie ";
    response.error = error.message;
    return res.status(500).json(response);
  }
});
//Ajouter un film dans la liste de film d'un utilisateur
router.post("/users/:userId/movies", async (req, res) => {
  const { userId } = req.params;
  const { movie } = req.body;

  const response = new APIResponse();

  try {
    userFound = await userSchema.findOne({ id: userId });

    if (userFound == null) {
      response.success = false;
      response.message = "User not found";
      return res.status(404).json(response);
    }
    userFound.movies.push(movie);

    await userFound.save();

    response.success = true;
    response.message = "movie added";
    response.movie = movie;
    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error when adding favorite movie";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//Retirer un film de la liste de films d'un utilisateur
router.delete("/users/:userId/movies/:movieId", async (req, res) => {
  const { userId } = req.params;
  const { movieId } = req.params;

  const response = new APIResponse();

  try {
    const user = await User.findOneAndUpdate(
      { id: userId },
      {
        $pull: { movies: { id: Number(movieId) } },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    response.success = true;
    response.movieList = user.movies;
    response.message = "The movie has been successfully removed. ";

    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error when removing favorite movie";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

//vider la liste de films d'un utilisater
router.delete("/users/:userId/movies", async (req, res) => {
  const { userId } = req.params;
  const response = new APIResponse();

  try {
    const userFound = await userSchema.findOne({ id: userId });

    if (userFound == null) {
      response.success = false;
      response.message = "User not found";
      return res.status(404).json(response);
    }

    userFound.movies = [];
    await userFound.save();

    response.success = true;
    response.message = "Clearing of user favorite movies complete";
    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error while clearing favorite movies";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

function errorResponse(res, message, statusCode = 500, error = null) {
  const response = {
    success: false,
    message: message,
  };

  if (error) {
    response.error = error.message;
  }

  return res.status(statusCode).json(response);
}

module.exports = router;
