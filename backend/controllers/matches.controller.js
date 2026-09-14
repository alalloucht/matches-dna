const pool = require("../db");


// ============================================================
// GET /matches
// Pagination + Search + Filters
// ============================================================

async function getMatches(req, res) {

  try {

    // ========================================================
    // PAGINATION
    // ========================================================

    let page = Number.parseInt(
      req.query.page,
      10
    );

    if (
      !Number.isInteger(page) ||
      page < 1
    ) {
      page = 1;
    }


    let limit = Number.parseInt(
      req.query.limit,
      10
    );

    if (
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      limit = 50;
    }


    // Maximum 100 records per request

    if (limit > 100) {
      limit = 100;
    }


    const offset =
      (page - 1) * limit;


    // ========================================================
    // SEARCH
    // ========================================================

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";


    // ========================================================
    // FILTERS
    // ========================================================

    const pays =
      typeof req.query.pays === "string"
        ? req.query.pays.trim()
        : "";


    const region =
      typeof req.query.region === "string"
        ? req.query.region.trim()
        : "";


    const province =
      typeof req.query.province === "string"
        ? req.query.province.trim()
        : "";


    const ydnahaplogroup =
      typeof req.query.ydnahaplogroup === "string"
        ? req.query.ydnahaplogroup.trim()
        : "";


    const ydnasubclade =
      typeof req.query.ydnasubclade === "string"
        ? req.query.ydnasubclade.trim()
        : "";


    const mtdna =
      typeof req.query.mtdna === "string"
        ? req.query.mtdna.trim()
        : "";


    const tribe =
      typeof req.query.tribe === "string"
        ? req.query.tribe.trim()
        : "";


    // ========================================================
    // BUILD WHERE
    // ========================================================

    const conditions = [];

    const params = [];


    // ========================================================
    // SEARCH
    //
    // Search in:
    //
    // fullname
    // firstname
    // middlename
    // lastname
    // ancestralsurname
    // ydnahaplogroup
    // ydnasubclade
    // mtdna
    // ========================================================

    if (search) {

      conditions.push(`
        (
          fullname LIKE ?
          OR firstname LIKE ?
          OR middlename LIKE ?
          OR lastname LIKE ?
          OR ancestralsurname LIKE ?
          OR ydnahaplogroup LIKE ?
          OR ydnasubclade LIKE ?
          OR mtdna LIKE ?
        )
      `);


      const searchValue =
        `%${search}%`;


      params.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );

    }


    // ========================================================
    // COUNTRY
    // ========================================================

    if (pays) {

      conditions.push(
        "pays = ?"
      );

      params.push(pays);

    }


    // ========================================================
    // REGION
    // ========================================================

    if (region) {

      conditions.push(
        "region = ?"
      );

      params.push(region);

    }


    // ========================================================
    // PROVINCE
    // ========================================================

    if (province) {

      conditions.push(
        "province = ?"
      );

      params.push(province);

    }


    // ========================================================
    // Y-DNA HAPLOGROUP
    // ========================================================

    if (ydnahaplogroup) {

      conditions.push(
        "ydnahaplogroup = ?"
      );

      params.push(
        ydnahaplogroup
      );

    }


    // ========================================================
    // Y-DNA SUBCLADE
    // ========================================================

    if (ydnasubclade) {

      conditions.push(
        "ydnasubclade = ?"
      );

      params.push(
        ydnasubclade
      );

    }


    // ========================================================
    // mtDNA
    // ========================================================

    if (mtdna) {

      conditions.push(
        "mtdna = ?"
      );

      params.push(mtdna);

    }


    // ========================================================
    // TRIBE
    // ========================================================

    if (tribe) {

      conditions.push(
        "tribe = ?"
      );

      params.push(tribe);

    }


    // ========================================================
    // WHERE CLAUSE
    // ========================================================

    let whereClause = "";

    if (conditions.length > 0) {

      whereClause =
        "WHERE " +
        conditions.join(" AND ");

    }


    // ========================================================
    // TOTAL
    // ========================================================

    const countSql = `
      SELECT COUNT(*) AS total
      FROM result
      ${whereClause}
    `;


    const [countRows] =
      await pool.query(
        countSql,
        params
      );


    const total =
      Number(countRows[0].total);


    // ========================================================
    // TOTAL PAGES
    // ========================================================

    const totalPages =
      Math.ceil(
        total / limit
      );


    // ========================================================
    // PAGE OUT OF RANGE
    // ========================================================

    if (
      totalPages > 0 &&
      page > totalPages
    ) {

      return res.status(400).json({

        error: "Page out of range",

        pagination: {
          page,
          limit,
          total,
          totalPages
        }

      });

    }


    // ========================================================
    // GET DATA
    // ========================================================

    const dataSql = `
      SELECT
        id,
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
        details,
        createdAt,
        updatedAt
      FROM result

      ${whereClause}

      ORDER BY id DESC

      LIMIT ? OFFSET ?
    `;


    const dataParams = [
      ...params,
      limit,
      offset
    ];


    const [rows] =
      await pool.query(
        dataSql,
        dataParams
      );


    // ========================================================
    // RESPONSE
    // ========================================================

    res.json({

      data: rows,

      pagination: {

        page,

        limit,

        total,

        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1

      }

    });


  } catch (error) {

    console.error(
      "Error getting matches:",
      error
    );


    res.status(500).json({

      error:
        "Failed to get matches"

    });

  }

}


// ============================================================
// GET /matches/:id
// ============================================================

async function getMatchById(req, res) {

  try {

    const { id } =
      req.params;


    const [rows] =
      await pool.query(
        "SELECT * FROM result WHERE id = ?",
        [id]
      );


    if (rows.length === 0) {

      return res.status(404).json({

        error:
          "Match not found"

      });

    }


    res.json(
      rows[0]
    );


  } catch (error) {

    console.error(
      "Error getting match:",
      error
    );


    res.status(500).json({

      error:
        "Failed to get match"

    });

  }

}


// ============================================================
// POST /matches
// ============================================================

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


    if (
      !fullname ||
      !String(fullname).trim()
    ) {

      return res.status(400).json({

        error:
          "fullname is required"

      });

    }


    const [result] =
      await pool.query(
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

        VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?
        )
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


    const [rows] =
      await pool.query(
        "SELECT * FROM result WHERE id = ?",
        [result.insertId]
      );


    res.status(201).json(
      rows[0]
    );


  } catch (error) {

    console.error(
      "Error creating match:",
      error
    );


    res.status(500).json({

      error:
        "Failed to create match"

    });

  }

}


// ============================================================
// PUT /matches/:id
// ============================================================

async function updateMatch(req, res) {

  try {

    const { id } =
      req.params;


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


    const [existing] =
      await pool.query(
        "SELECT id FROM result WHERE id = ?",
        [id]
      );


    if (
      existing.length === 0
    ) {

      return res.status(404).json({

        error:
          "Match not found"

      });

    }


    if (
      !fullname ||
      !String(fullname).trim()
    ) {

      return res.status(400).json({

        error:
          "fullname is required"

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


    const [rows] =
      await pool.query(
        "SELECT * FROM result WHERE id = ?",
        [id]
      );


    res.json(
      rows[0]
    );


  } catch (error) {

    console.error(
      "Error updating match:",
      error
    );


    res.status(500).json({

      error:
        "Failed to update match"

    });

  }

}


// ============================================================
// DELETE /matches/:id
// ============================================================

async function deleteMatch(req, res) {

  try {

    const { id } =
      req.params;


    const [existing] =
      await pool.query(
        "SELECT id FROM result WHERE id = ?",
        [id]
      );


    if (
      existing.length === 0
    ) {

      return res.status(404).json({

        error:
          "Match not found"

      });

    }


    await pool.query(
      "DELETE FROM result WHERE id = ?",
      [id]
    );


    res.json({

      message:
        "Match deleted successfully",

      id:
        Number(id)

    });


  } catch (error) {

    console.error(
      "Error deleting match:",
      error
    );


    res.status(500).json({

      error:
        "Failed to delete match"

    });

  }

}


async function getMatchStats(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS totalMatches,
        COUNT(DISTINCT NULLIF(TRIM(pays), '')) AS countries,
        COUNT(DISTINCT NULLIF(TRIM(region), '')) AS regions,
        COUNT(DISTINCT NULLIF(TRIM(ydnahaplogroup), '')) AS ydnaHaplogroups,
        COUNT(DISTINCT NULLIF(TRIM(mtdna), '')) AS mtdnaHaplogroups
      FROM result
    `);

    res.json(rows[0]);

  } catch (error) {
    console.error("Get match stats error:", error);

    res.status(500).json({
      message: "Failed to fetch match statistics"
    });
  }
}


async function getRecentMatches(req, res) {
  try {
    let limit = Number.parseInt(req.query.limit, 10);

    if (!Number.isInteger(limit) || limit <= 0) {
      limit = 10;
    }

    if (limit > 50) {
      limit = 50;
    }

    const [rows] = await pool.query(`
      SELECT
        id,
        fullname,
        ydnahaplogroup,
        ydnasubclade,
        mtdna,
        pays,
        region,
        createdAt,
        updatedAt
      FROM result
      ORDER BY id DESC
      LIMIT ?
    `, [limit]);

    res.json(rows);

  } catch (error) {
    console.error("Get recent matches error:", error);

    res.status(500).json({
      message: "Failed to fetch recent matches"
    });
  }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getMatchStats,
  getRecentMatches
};
