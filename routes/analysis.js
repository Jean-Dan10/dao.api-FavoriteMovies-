const express = require("express");
const router = express.Router();
const userSchema = require("../models/favoriteMovie");
const APIResponse = require("../models/apiResponse");

const { response } = require("../app");

router.get("/most-saved-movie", async (req, res) => {
  const response = new APIResponse();

  try {
    const pipeline = [
      { $unwind: "$movies" },
      {
        $group: {
          _id: "$movies.id",
          title: { $first: "$movies.title" },
          total: { $sum: 1 },
          posterPath: { $first: "$movies.posterPath" },
        },
      },
      { $sort: { total: -1 } },
    ];
    const data = await userSchema
      .aggregate(pipeline)
     

    response.data = data;
    response.success = true;
    response.message = "Top movie in favorite list";
    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error retrieving data";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

router.get("/count-user", async (req, res) => {
  const response = new APIResponse();

  try {
    const pipeline = [
      {
        $group: {
          _id: null,

          numberOfUsers: { $sum: 1 },
        },
      },
      { $project: { _id: 0, numberOfUsers: 1 } },
    ];
    const data = await userSchema.aggregate(pipeline);

    response.data = data[0];
    response.success = true;
    response.message = "Number of users";
    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error retrieving data";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

router.get("/count-total-movie-saved", async (req, res) => {
  const response = new APIResponse();

  try {
    const pipeline = [
      { $unwind: "$movies" },
      {
        $group: {
          _id: null,
          numberOfMovies: { $sum: 1 },
        },
      },
      { $project: { _id: 0, numberOfMovies: 1 } },
    ];
    const data = await userSchema.aggregate(pipeline);

    response.data = data[0];
    response.success = true;
    response.message = "Number of movies saved";
    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error retrieving data";
    response.error = error.message;
    return res.status(500).json(response);
  }
});
module.exports = router;

router.get("/average-movie-by-list", async (req, res) => {
  const response = new APIResponse();

  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalMovies: { $sum: { $size: "$movies" } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          globalAverageMovies: { $divide: ["$totalMovies", "$count"] },
        },
      },
    ];
    const data = await userSchema.aggregate(pipeline);

    response.data = data[0];
    response.success = true;
    response.message = "Average movie by list";
    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error retrieving data";
    response.error = error.message;
    return res.status(500).json(response);
  }
});
module.exports = router;
