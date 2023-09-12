const express = require("express");
const router = express.Router();
const user = require("../models/favoriteMovie");
// const { body, validationResult } = require("express-validator");

// const UserValidation = [
//   body("User.id").isNumeric(),
//   body("User.username").isString().isLength({ min: 1 }),
//   body("User.password").isString().isLength({ min: 3 }),
// ];

const { route } = require("../app");
const User = require("../models/favoriteMovie");

//Ajouter un utilisateur
router.post("/users", async (req, res) => {
 
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const { User } = req.body;

  try {
    

    const newUser = await user.create(User);

    res.status(201).json(newUser);

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de l'utilisateur",
      error: error.Message,
    });
  }
});

//Supprimer un utilisateur
router.delete("/users/:userId", async (req, res) => {
  const { UserId } = req.params;

  try {
    userFound = await user.findOne({ UserId: UserId });

    if (userFound == null) {
      res.status(404).json({ Message: "Utilisateur non trouvé" });
    }

    await user.deleteOne({ UserId: UserId });

    res.json({ Message: "Utilisateur supprimer", User: userFound });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de le suppression de l'utilisateur",
      error: error.Message,
    });
  }
});

//Trouver utilisateur
router.get("/users/:userId", async (req, res) => {
  const { UserId } = req.params;

  try {
    userFound = await user.findOne({ UserId: UserId });

    if (userFound === null) {
      res.status(404).json({ Message: "Utilisateur non trouvé" });
    }

    res.json(userFound);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche de l'utilisateur",
      error: error.Message,
    });
  }
});

//Trouver la liste de TOUS utilisateurs
router.get("/users", async (req, res) => {
  try {
    const usersFound = await user.find();

    res.json(usersFound);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche des utilisateurs",
      error: error.Message,
    });
  }
});

//Trouver la liste de film d'un utilisateur
router.get("/users/:userId/movies", async (req, res) => {
  const { userId } = req.params;

  try {

    userFound = await user.findOne({ UserId: userId });

    if (userFound == null) {
      res.status(404).json({ Message: "Utilisateur non trouvé" });
    }

    const favoriteList = await user.findOne({ UserId: userId });
    if (!favoriteList) {
      res.status(404).send("Utilisateur non trouvé");
    } else {
      res.json(favoriteList.movies);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche de l'utilisateur",
      error: error.Message,
    });
  }
});

//À mmodifier
//Ajouter un film dans la liste de film d'un utilisateur
router.post("/users/:userId/movies", async (req, res) => {
  const { userId } = req.params;
  const { movie } = req.body;

  try {
    userFound = await user.findOne({ UserId: userId });

    if (!userFound == null) {
      res.status(404).send("Utilisateur non trouvé");
    }
    userFound.movies.push(movie);

    await userFound.save();

    res.status(200).json({movie:movie});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du film dans la liste des favoris",
      error: error.Message,
    });
  }
});

//**Modifier en delete  vérifier sur postman*/
//modifier pour supprimer le film en fonction de id

//Retirer un film de la liste de films d'un utilisateur
router.delete("/users/:userId/movies/:movieid", async (req, res) => {
  const { UserId } = req.params;
  const { movie } = req.params;

  try {
    userFound = await user.findOne({ UserId: UserId });

    if (!userFound == null) {
      res.status(404).send("Utilisateur non trouvé");
    }
    userFound.movies.pull(movie);

    await userFound.save();

    res.status(200).send(movie);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du retrait du film dans la liste des favoris",
      error: error.Message,
    });
  }
});

//vider la listeliste de films d'un utilisater
router.delete("/user/:userId/remove-all-movies", async (req, res) => {
  const { userId } = req.params;

  try {
    userFound = await user.findOne({ UserId: UserId });

    if (userFound == null) {
      res.status(404).send("Utilisateur non trouvé");
    }

    await user.updateOne({ UserId: UserId }, { $set: { movies: [] } });

    res.status(200).json({ message: "La liste des favoris à été vidée" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du clear de la liste des favoris",
      error: error.Message,
    });
  }
});

module.exports = router;
