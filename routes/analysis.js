const express = require("express");
const router = express.Router();
const userSchema = require("../models/favoriteMovie");
const APIResponse = require("../models/apiResponse");

router.get("/most-saved-movie", async (req, res) => {
  response = new APIResponse();

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
    const data = await userSchema.aggregate(pipeline).limit(5);

    return res.status(200).json(data);
  } catch (error) {
    response.success = false;
    response.message = "Error retrieving data";
    response.error = error.message;
    return res.status(500).json(response);
  }
});

module.exports = router;
