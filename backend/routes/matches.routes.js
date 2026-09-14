const express = require("express");

const router = express.Router();

const {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getMatchStats,
  getRecentMatches
} = require("../controllers/matches.controller");

// GET /matches
router.get("/", getMatches);

router.get("/stats", getMatchStats);
router.get("/recent", getRecentMatches);


// GET /matches/:id
router.get("/:id", getMatchById);

// POST /matches
router.post("/", createMatch);

// PUT /matches/:id
router.put("/:id", updateMatch);

// DELETE /matches/:id
router.delete("/:id", deleteMatch);


module.exports = router;