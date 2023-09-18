const express = require("express");
const router = express.Router();
const userSchema = require("../models/favoriteMovie");
const APIResponse = require("../models/apiResponse");
const config = require("../config/config")

const { response } = require("../app");

router.get("/most-saved-movie", async (req, res) => {
  const response = new APIResponse();

  const { start, end } = req.query;

  const startIndex = parseInt(start,10) || 0;
  const endIndex = parseInt(end,10) || config.defaultPerPage 

  try {
    const pipeline = [
      { $unwind: "$movies" },
      {
        $group: {
          _id: "$movies.id",
          title: { $first: "$movies.title" },
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ];
    const data = await userSchema.aggregate(pipeline).skip(startIndex).limit(endIndex);

    response.data = data
    response.success = true
    response.message = "Top movie in favorite list"
    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Error retrieving data";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

module.exports = router;
