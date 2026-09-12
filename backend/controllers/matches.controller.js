const pool = require("../db");

// GET /matches
// Get all matches
async function getMatches(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM result ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error getting matches:", error);

    res.status(500).json({
      error: "Failed to get matches"
    });
  }
}

// GET /matches/:id
// Get one match
async function getMatchById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM result WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Match not found"
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error getting match:", error);

    res.status(500).json({
      error: "Failed to get match"
    });
  }
}

// POST /matches
// Create a new match
async function createMatch(req, res) {
  try {
    const {
      fullname,
      firstname,
      middlename,
      lastname,
      ancestralsurname,
      ydnahaplogroup,
      ydnasubclade,
      mtdna,
      pays,
      region,
      province,
      commun,
      tribe,
      details
    } = req.body;

    if (!fullname) {
      return res.status(400).json({
        error: "fullname is required"
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO result (
        fullname,
        firstname,
        middlename,
        lastname,
        ancestralsurname,
        ydnahaplogroup,
        ydnasubclade,
        mtdna,
        pays,
        region,
        province,
        commun,
        tribe,
        details
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        fullname,
        firstname ?? null,
        middlename ?? null,
        lastname ?? null,
        ancestralsurname ?? null,
        ydnahaplogroup ?? null,
        ydnasubclade ?? null,
        mtdna ?? null,
        pays ?? null,
        region ?? null,
        province ?? null,
        commun ?? null,
        tribe ?? null,
        details ?? null
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM result WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating match:", error);

    res.status(500).json({
      error: "Failed to create match"
    });
  }
}

// PUT /matches/:id
// Update a match
async function updateMatch(req, res) {
  try {
    const { id } = req.params;

    const {
      fullname,
      firstname,
      middlename,
      lastname,
      ancestralsurname,
      ydnahaplogroup,
      ydnasubclade,
      mtdna,
      pays,
      region,
      province,
      commun,
      tribe,
      details
    } = req.body;

    const [existing] = await pool.query(
      "SELECT * FROM result WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        error: "Match not found"
      });
    }

    if (!fullname) {
      return res.status(400).json({
        error: "fullname is required"
      });
    }

    await pool.query(
      `
      UPDATE result
      SET
        fullname = ?,
        firstname = ?,
        middlename = ?,
        lastname = ?,
        ancestralsurname = ?,
        ydnahaplogroup = ?,
        ydnasubclade = ?,
        mtdna = ?,
        pays = ?,
        region = ?,
        province = ?,
        commun = ?,
        tribe = ?,
        details = ?
      WHERE id = ?
      `,
      [
        fullname,
        firstname ?? null,
        middlename ?? null,
        lastname ?? null,
        ancestralsurname ?? null,
        ydnahaplogroup ?? null,
        ydnasubclade ?? null,
        mtdna ?? null,
        pays ?? null,
        region ?? null,
        province ?? null,
        commun ?? null,
        tribe ?? null,
        details ?? null,
        id
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM result WHERE id = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating match:", error);

    res.status(500).json({
      error: "Failed to update match"
    });
  }
}

// DELETE /matches/:id
// Delete a match
async function deleteMatch(req, res) {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      "SELECT * FROM result WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        error: "Match not found"
      });
    }

    await pool.query(
      "DELETE FROM result WHERE id = ?",
      [id]
    );

    res.json({
      message: "Match deleted successfully",
      id: Number(id)
    });
  } catch (error) {
    console.error("Error deleting match:", error);

    res.status(500).json({
      error: "Failed to delete match"
    });
  }
}

module.exports = {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
};