const express = require("express");

const router = express.Router();

const {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} = require("../controllers/matches.controller");

// GET /matches
router.get("/", getMatches);

// GET /matches/:id
router.get("/:id", getMatchById);

// POST /matches
router.post("/", createMatch);

// PUT /matches/:id
router.put("/:id", updateMatch);

// DELETE /matches/:id
router.delete("/:id", deleteMatch);

module.exports = router;