import "./styles.css";

import type { Match } from "./types/match";

import {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  type MatchFilters,
} from "./services/matchService";


// ============================================================
// APP STATE
// ============================================================

let matches: Match[] = [];

let currentMatchesPage = 1;

const matchesPageLimit = 50;

let matchesPagination = {
  page: 1,
  limit: matchesPageLimit,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};


// Current search / filters

let currentFilters: MatchFilters = {};


// ============================================================
// DOM ELEMENTS
// ============================================================

const pageTitle =
  document.getElementById("pageTitle");

const pageDescription =
  document.getElementById("pageDescription");

const pageContent =
  document.getElementById("pageContent");


// ============================================================
// HTML HELPERS
// ============================================================

function escapeHtml(
  value: string | null
): string {

  if (value === null) {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttribute(
  value: string | null
): string {

  if (value === null) {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


// ============================================================
// LOADING
// ============================================================

function showLoading(): void {

  if (!pageContent) {
    return;
  }

  pageContent.innerHTML = `
    <div class="loading">
      Loading...
    </div>
  `;
}


// ============================================================
// ERROR
// ============================================================

function showError(
  message: string
): void {

  if (!pageContent) {
    return;
  }

  pageContent.innerHTML = `
    <div class="error-message">
      ${escapeHtml(message)}
    </div>
  `;
}


// ============================================================
// DASHBOARD
// ============================================================

async function renderDashboard(): Promise<void> {

  if (
    !pageTitle ||
    !pageDescription ||
    !pageContent
  ) {
    return;
  }


  pageTitle.textContent =
    "Dashboard";


  pageDescription.textContent =
    "Overview of your DNA matches";


  showLoading();


  try {

    /*
     * Only request one record.
     *
     * We use pagination.total
     * to know the total number.
     */

    const result =
      await getMatches(1, 1);


    const total =
      result.pagination.total;


    pageContent.innerHTML = `

      <div class="page-header">

        <div>

          <h3>
            Dashboard
          </h3>

          <p>
            Overview of your DNA matches database.
          </p>

        </div>

      </div>


      <div class="dashboard-grid">


        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Total Matches
          </div>

          <div class="dashboard-card-value">
            ${total.toLocaleString()}
          </div>

        </div>


        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Database
          </div>

          <div class="dashboard-card-value">
            MySQL
          </div>

        </div>


        <div class="dashboard-card">

          <div class="dashboard-card-title">
            API
          </div>

          <div class="dashboard-card-value">
            Online
          </div>

        </div>


      </div>

    `;

  } catch (error) {

    console.error(
      "Dashboard error:",
      error
    );


    showError(
      error instanceof Error
        ? error.message
        : "Failed to load dashboard"
    );

  }

}


// ============================================================
// MATCHES PAGE
// ============================================================

async function renderMatches(
  page: number = currentMatchesPage
): Promise<void> {

  if (
    !pageTitle ||
    !pageDescription ||
    !pageContent
  ) {
    return;
  }


  pageTitle.textContent =
    "Matches";


  pageDescription.textContent =
    "Search, filter and manage your DNA matches";


  showLoading();


  try {

    const result =
      await getMatches(
        page,
        matchesPageLimit,
        currentFilters
      );


    matches =
      result.data;


    matchesPagination =
      result.pagination;


    currentMatchesPage =
      result.pagination.page;


    renderMatchesContent();


  } catch (error) {

    console.error(
      "Matches error:",
      error
    );


    showError(
      error instanceof Error
        ? error.message
        : "Failed to load matches"
    );

  }

}


// ============================================================
// MATCHES CONTENT
// ============================================================

function renderMatchesContent(): void {

  if (!pageContent) {
    return;
  }


  const total =
    matchesPagination.total;


  const page =
    matchesPagination.page;


  const limit =
    matchesPagination.limit;


  let start = 0;

  let end = 0;


  if (total > 0) {

    start =
      (page - 1) * limit + 1;


    end =
      Math.min(
        page * limit,
        total
      );

  }


  pageContent.innerHTML = `

    <!-- ===================================================== -->
    <!-- PAGE HEADER -->
    <!-- ===================================================== -->

    <div class="page-header">

      <div>

        <h3>
          DNA Matches
        </h3>

        <p>
          Showing
          ${start.toLocaleString()}
          –
          ${end.toLocaleString()}
          of
          ${total.toLocaleString()}
          matches
        </p>

      </div>


      <button
        id="addMatchButton"
        class="primary-button"
      >
        + Add Match
      </button>

    </div>


    <!-- ===================================================== -->
    <!-- SEARCH + FILTERS -->
    <!-- ===================================================== -->

    ${renderSearchAndFilters()}


    <!-- ===================================================== -->
    <!-- TABLE -->
    <!-- ===================================================== -->

    ${
      matches.length === 0

        ? `

          <div class="empty-state">

            No matches found.

          </div>

        `

        : `

          <div class="table-container">

            <table class="matches-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Full Name</th>

                  <th>Y-DNA</th>

                  <th>Y-DNA Subclade</th>

                  <th>mtDNA</th>

                  <th>Country</th>

                  <th>Region</th>

                  <th>Province</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                ${matches
                  .map(renderMatchRow)
                  .join("")}

              </tbody>

            </table>

          </div>

        `
    }


    <!-- ===================================================== -->
    <!-- PAGINATION -->
    <!-- ===================================================== -->

    ${renderPagination()}

  `;


  setupMatchesEvents();

}


// ============================================================
// SEARCH + FILTER UI
// ============================================================

function renderSearchAndFilters(): string {

  return `

    <div class="filters-container">


      <!-- ================================================= -->
      <!-- SEARCH -->
      <!-- ================================================= -->

      <div class="search-row">

        <div class="search-group">

          <label for="searchInput">
            Search
          </label>

          <input
            id="searchInput"
            type="text"
            placeholder="Search name, haplogroup, mtDNA..."
            value="${escapeAttribute(
              currentFilters.search ?? ""
            )}"
          />

        </div>


        <button
          id="searchButton"
          class="primary-button"
          type="button"
        >
          Search
        </button>

      </div>


      <!-- ================================================= -->
      <!-- FILTERS -->
      <!-- ================================================= -->

      <div class="filters-grid">


        <!-- COUNTRY -->

        <div class="filter-group">

          <label for="paysFilter">
            Country
          </label>

          <input
            id="paysFilter"
            type="text"
            placeholder="Country"
            value="${escapeAttribute(
              currentFilters.pays ?? ""
            )}"
          />

        </div>


        <!-- REGION -->

        <div class="filter-group">

          <label for="regionFilter">
            Region
          </label>

          <input
            id="regionFilter"
            type="text"
            placeholder="Region"
            value="${escapeAttribute(
              currentFilters.region ?? ""
            )}"
          />

        </div>


        <!-- PROVINCE -->

        <div class="filter-group">

          <label for="provinceFilter">
            Province
          </label>

          <input
            id="provinceFilter"
            type="text"
            placeholder="Province"
            value="${escapeAttribute(
              currentFilters.province ?? ""
            )}"
          />

        </div>


        <!-- Y-DNA -->

        <div class="filter-group">

          <label for="ydnahaplogroupFilter">
            Y-DNA Haplogroup
          </label>

          <input
            id="ydnahaplogroupFilter"
            type="text"
            placeholder="J-M267"
            value="${escapeAttribute(
              currentFilters.ydnahaplogroup ?? ""
            )}"
          />

        </div>


        <!-- Y-DNA SUBCLADE -->

        <div class="filter-group">

          <label for="ydnasubcladeFilter">
            Y-DNA Subclade
          </label>

          <input
            id="ydnasubcladeFilter"
            type="text"
            placeholder="J-Z1828"
            value="${escapeAttribute(
              currentFilters.ydnasubclade ?? ""
            )}"
          />

        </div>


        <!-- mtDNA -->

        <div class="filter-group">

          <label for="mtdnaFilter">
            mtDNA
          </label>

          <input
            id="mtdnaFilter"
            type="text"
            placeholder="H1"
            value="${escapeAttribute(
              currentFilters.mtdna ?? ""
            )}"
          />

        </div>


        <!-- TRIBE -->

        <div class="filter-group">

          <label for="tribeFilter">
            Tribe
          </label>

          <input
            id="tribeFilter"
            type="text"
            placeholder="Tribe"
            value="${escapeAttribute(
              currentFilters.tribe ?? ""
            )}"
          />

        </div>


      </div>


      <!-- ================================================= -->
      <!-- FILTER ACTIONS -->
      <!-- ================================================= -->

      <div class="filter-actions">

        <button
          id="applyFiltersButton"
          class="primary-button"
          type="button"
        >
          Apply Filters
        </button>


        <button
          id="clearFiltersButton"
          class="secondary-button"
          type="button"
        >
          Clear Filters
        </button>

      </div>


    </div>

  `;
}


// ============================================================
// READ FILTER VALUE
// ============================================================

function getInputValue(
  id: string
): string {

  const element =
    document.getElementById(id);


  if (
    !(element instanceof HTMLInputElement)
  ) {

    return "";

  }


  return element.value.trim();

}


// ============================================================
// APPLY SEARCH + FILTERS
// ============================================================

function applyFilters(): void {

  currentFilters = {

    search:
      getInputValue(
        "searchInput"
      ),

    pays:
      getInputValue(
        "paysFilter"
      ),

    region:
      getInputValue(
        "regionFilter"
      ),

    province:
      getInputValue(
        "provinceFilter"
      ),

    ydnahaplogroup:
      getInputValue(
        "ydnahaplogroupFilter"
      ),

    ydnasubclade:
      getInputValue(
        "ydnasubcladeFilter"
      ),

    mtdna:
      getInputValue(
        "mtdnaFilter"
      ),

    tribe:
      getInputValue(
        "tribeFilter"
      ),

  };


  /*
   * Remove empty values.
   *
   * This keeps the object clean.
   */

  Object.keys(
    currentFilters
  ).forEach(
    (key) => {

      const value =
        currentFilters[
          key as keyof MatchFilters
        ];


      if (
        !value ||
        !value.trim()
      ) {

        delete currentFilters[
          key as keyof MatchFilters
        ];

      }

    }
  );


  /*
   * When search/filter changes,
   * always start from page 1.
   */

  currentMatchesPage = 1;


  void renderMatches(1);

}


// ============================================================
// CLEAR FILTERS
// ============================================================

function clearFilters(): void {

  currentFilters = {};

  currentMatchesPage = 1;

  void renderMatches(1);

}


// ============================================================
// SETUP MATCH EVENTS
// ============================================================

function setupMatchesEvents(): void {


  // ==========================================================
  // ADD
  // ==========================================================

  const addButton =
    document.getElementById(
      "addMatchButton"
    );


  addButton?.addEventListener(
    "click",
    () => {

      renderAddMatchForm();

    }
  );


  // ==========================================================
  // SEARCH BUTTON
  // ==========================================================

  const searchButton =
    document.getElementById(
      "searchButton"
    );


  searchButton?.addEventListener(
    "click",
    () => {

      applyFilters();

    }
  );


  // ==========================================================
  // APPLY FILTERS
  // ==========================================================

  const applyFiltersButton =
    document.getElementById(
      "applyFiltersButton"
    );


  applyFiltersButton?.addEventListener(
    "click",
    () => {

      applyFilters();

    }
  );


  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFiltersButton =
    document.getElementById(
      "clearFiltersButton"
    );


  clearFiltersButton?.addEventListener(
    "click",
    () => {

      clearFilters();

    }
  );


  // ==========================================================
  // SEARCH WITH ENTER
  // ==========================================================

  const searchInput =
    document.getElementById(
      "searchInput"
    );


  searchInput?.addEventListener(
    "keydown",
    (event) => {

      if (
        event instanceof KeyboardEvent &&
        event.key === "Enter"
      ) {

        applyFilters();

      }

    }
  );


  // ==========================================================
  // EDIT
  // ==========================================================

  document
    .querySelectorAll<HTMLButtonElement>(
      ".edit-match-button"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          async () => {

            const id =
              Number(
                button.dataset.id
              );


            if (
              !Number.isInteger(id)
            ) {

              return;

            }


            await renderEditMatchForm(id);

          }
        );

      }
    );


  // ==========================================================
  // DELETE
  // ==========================================================

  document
    .querySelectorAll<HTMLButtonElement>(
      ".delete-match-button"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          async () => {

            const id =
              Number(
                button.dataset.id
              );


            if (
              !Number.isInteger(id)
            ) {

              return;

            }


            await handleDeleteMatch(id);

          }
        );

      }
    );


  // ==========================================================
  // PAGINATION
  // ==========================================================

  document
    .querySelectorAll<HTMLButtonElement>(
      ".pagination-button"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          async () => {

            const page =
              Number(
                button.dataset.page
              );


            if (
              !Number.isInteger(page)
            ) {

              return;

            }


            if (
              page < 1 ||
              page >
                matchesPagination.totalPages
            ) {

              return;

            }


            currentMatchesPage =
              page;


            await renderMatches(
              page
            );

          }
        );

      }
    );

}


// ============================================================
// MATCH ROW
// ============================================================

function renderMatchRow(
  match: Match
): string {

  return `

    <tr>

      <td>
        ${match.id}
      </td>


      <td>
        ${escapeHtml(
          match.fullname
        )}
      </td>


      <td>
        ${escapeHtml(
          match.ydnahaplogroup
        )}
      </td>


      <td>
        ${escapeHtml(
          match.ydnasubclade
        )}
      </td>


      <td>
        ${escapeHtml(
          match.mtdna
        )}
      </td>


      <td>
        ${escapeHtml(
          match.pays
        )}
      </td>


      <td>
        ${escapeHtml(
          match.region
        )}
      </td>


      <td>
        ${escapeHtml(
          match.province
        )}
      </td>


      <td>

        <div class="action-buttons">

          <button
            class="action-button edit-match-button"
            data-id="${match.id}"
          >
            Edit
          </button>


          <button
            class="action-button delete-match-button"
            data-id="${match.id}"
          >
            Delete
          </button>

        </div>

      </td>

    </tr>

  `;

}


// ============================================================
// PAGINATION
// ============================================================

function renderPagination(): string {

  const totalPages =
    matchesPagination.totalPages;


  const currentPage =
    matchesPagination.page;


  if (
    totalPages <= 1
  ) {

    return "";

  }


  const pages:
    Array<number | "ellipsis"> = [];


  // ==========================================================
  // 7 PAGES OR LESS
  // ==========================================================

  if (
    totalPages <= 7
  ) {

    for (
      let i = 1;
      i <= totalPages;
      i++
    ) {

      pages.push(i);

    }

  }


  // ==========================================================
  // MANY PAGES
  // ==========================================================

  else {

    pages.push(1);


    // Near beginning

    if (
      currentPage <= 4
    ) {

      pages.push(2);
      pages.push(3);
      pages.push(4);
      pages.push(5);

      pages.push(
        "ellipsis"
      );

      pages.push(
        totalPages
      );

    }


    // Middle

    else if (
      currentPage >= 5 &&
      currentPage <= totalPages - 4
    ) {

      pages.push(
        "ellipsis"
      );

      pages.push(
        currentPage - 1
      );

      pages.push(
        currentPage
      );

      pages.push(
        currentPage + 1
      );

      pages.push(
        "ellipsis"
      );

      pages.push(
        totalPages
      );

    }


    // Near end

    else {

      pages.push(
        "ellipsis"
      );

      pages.push(
        totalPages - 4
      );

      pages.push(
        totalPages - 3
      );

      pages.push(
        totalPages - 2
      );

      pages.push(
        totalPages - 1
      );

      pages.push(
        totalPages
      );

    }

  }


  return `

    <div class="pagination-container">


      <div class="pagination-info">

        Page
        ${currentPage.toLocaleString()}
        of
        ${totalPages.toLocaleString()}

      </div>


      <div class="pagination">


        <!-- PREVIOUS -->

        <button
          class="pagination-button"
          data-page="${currentPage - 1}"

          ${
            !matchesPagination.hasPreviousPage
              ? "disabled"
              : ""
          }
        >
          Previous
        </button>


        <!-- PAGE NUMBERS -->

        ${pages
          .map(
            (page) => {

              if (
                page === "ellipsis"
              ) {

                return `

                  <span
                    class="pagination-ellipsis"
                  >
                    ...
                  </span>

                `;

              }


              const active =
                page === currentPage
                  ? "active"
                  : "";


              return `

                <button
                  class="
                    pagination-button
                    ${active}
                  "
                  data-page="${page}"
                >
                  ${page}
                </button>

              `;

            }
          )
          .join("")}


        <!-- NEXT -->

        <button
          class="pagination-button"
          data-page="${currentPage + 1}"

          ${
            !matchesPagination.hasNextPage
              ? "disabled"
              : ""
          }
        >
          Next
        </button>


      </div>

    </div>

  `;

}


// ============================================================
// ADD MATCH
// ============================================================

function renderAddMatchForm(): void {

  if (
    !pageTitle ||
    !pageDescription ||
    !pageContent
  ) {

    return;

  }


  pageTitle.textContent =
    "Add Match";


  pageDescription.textContent =
    "Create a new DNA match";


  pageContent.innerHTML =
    renderMatchForm();


  setupMatchForm(
    async (data) => {

      try {

        await createMatch(
          data
        );


        /*
         * New match gets latest ID,
         * so go to page 1.
         */

        currentMatchesPage = 1;


        await renderMatches(
          1
        );


      } catch (error) {

        alert(
          error instanceof Error
            ? error.message
            : "Failed to create match"
        );

      }

    }
  );

}


// ============================================================
// EDIT MATCH
// ============================================================

async function renderEditMatchForm(
  id: number
): Promise<void> {

  if (
    !pageTitle ||
    !pageDescription ||
    !pageContent
  ) {

    return;

  }


  pageTitle.textContent =
    "Edit Match";


  pageDescription.textContent =
    "Update DNA match information";


  showLoading();


  try {

    const match =
      await getMatchById(
        id
      );


    pageContent.innerHTML =
      renderMatchForm(
        match
      );


    setupMatchForm(
      async (data) => {

        try {

          await updateMatch(
            id,
            data
          );


          await renderMatches(
            currentMatchesPage
          );


        } catch (error) {

          alert(
            error instanceof Error
              ? error.message
              : "Failed to update match"
          );

        }

      }
    );


  } catch (error) {

    console.error(
      "Edit match error:",
      error
    );


    showError(
      error instanceof Error
        ? error.message
        : "Failed to load match"
    );

  }

}


// ============================================================
// MATCH FORM
// ============================================================

function renderMatchForm(
  match?: Match
): string {

  const isEdit =
    Boolean(match);


  return `

    <form
      id="matchForm"
      class="match-form"
    >


      <!-- ================================================= -->
      <!-- PERSONAL INFORMATION -->
      <!-- ================================================= -->

      <div class="form-section">

        <h3>
          Personal Information
        </h3>


        <div class="form-grid">


          <div class="form-group">

            <label for="fullname">
              Full Name *
            </label>

            <input
              id="fullname"
              name="fullname"
              type="text"
              required

              value="${escapeAttribute(
                match?.fullname ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="firstname">
              First Name
            </label>

            <input
              id="firstname"
              name="firstname"
              type="text"

              value="${escapeAttribute(
                match?.firstname ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="middlename">
              Middle Name
            </label>

            <input
              id="middlename"
              name="middlename"
              type="text"

              value="${escapeAttribute(
                match?.middlename ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="lastname">
              Last Name
            </label>

            <input
              id="lastname"
              name="lastname"
              type="text"

              value="${escapeAttribute(
                match?.lastname ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="ancestralsurname">
              Ancestral Surname
            </label>

            <input
              id="ancestralsurname"
              name="ancestralsurname"
              type="text"

              value="${escapeAttribute(
                match?.ancestralsurname ?? ""
              )}"
            />

          </div>


        </div>

      </div>


      <!-- ================================================= -->
      <!-- DNA INFORMATION -->
      <!-- ================================================= -->

      <div class="form-section">

        <h3>
          DNA Information
        </h3>


        <div class="form-grid">


          <div class="form-group">

            <label for="ydnahaplogroup">
              Y-DNA Haplogroup
            </label>

            <input
              id="ydnahaplogroup"
              name="ydnahaplogroup"
              type="text"

              value="${escapeAttribute(
                match?.ydnahaplogroup ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="ydnasubclade">
              Y-DNA Subclade
            </label>

            <input
              id="ydnasubclade"
              name="ydnasubclade"
              type="text"

              value="${escapeAttribute(
                match?.ydnasubclade ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="mtdna">
              mtDNA
            </label>

            <input
              id="mtdna"
              name="mtdna"
              type="text"

              value="${escapeAttribute(
                match?.mtdna ?? ""
              )}"
            />

          </div>


        </div>

      </div>


      <!-- ================================================= -->
      <!-- LOCATION -->
      <!-- ================================================= -->

      <div class="form-section">

        <h3>
          Location
        </h3>


        <div class="form-grid">


          <div class="form-group">

            <label for="pays">
              Country
            </label>

            <input
              id="pays"
              name="pays"
              type="text"

              value="${escapeAttribute(
                match?.pays ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="region">
              Region
            </label>

            <input
              id="region"
              name="region"
              type="text"

              value="${escapeAttribute(
                match?.region ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="province">
              Province
            </label>

            <input
              id="province"
              name="province"
              type="text"

              value="${escapeAttribute(
                match?.province ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="commun">
              Commune
            </label>

            <input
              id="commun"
              name="commun"
              type="text"

              value="${escapeAttribute(
                match?.commun ?? ""
              )}"
            />

          </div>


          <div class="form-group">

            <label for="tribe">
              Tribe
            </label>

            <input
              id="tribe"
              name="tribe"
              type="text"

              value="${escapeAttribute(
                match?.tribe ?? ""
              )}"
            />

          </div>


        </div>

      </div>


      <!-- ================================================= -->
      <!-- DETAILS -->
      <!-- ================================================= -->

      <div class="form-section">

        <h3>
          Details
        </h3>


        <div class="form-group">

          <label for="details">
            Details
          </label>

          <textarea
            id="details"
            name="details"
            rows="5"
          >${escapeHtml(
            match?.details ?? ""
          )}</textarea>

        </div>

      </div>


      <!-- ================================================= -->
      <!-- ACTIONS -->
      <!-- ================================================= -->

      <div class="form-actions">

        <button
          type="submit"
          class="primary-button"
        >

          ${
            isEdit
              ? "Update Match"
              : "Create Match"
          }

        </button>


        <button
          type="button"
          id="cancelMatchButton"
          class="secondary-button"
        >
          Cancel
        </button>

      </div>


    </form>

  `;

}


// ============================================================
// FORM VALUE
// ============================================================

function getFormValue(
  form: HTMLFormElement,
  name: string
): string | null {

  const element =
    form.elements.namedItem(
      name
    );


  if (
    !(element instanceof HTMLInputElement) &&
    !(element instanceof HTMLTextAreaElement) &&
    !(element instanceof HTMLSelectElement)
  ) {

    return null;

  }


  const value =
    element.value.trim();


  return value === ""
    ? null
    : value;

}


// ============================================================
// SETUP FORM
// ============================================================

function setupMatchForm(
  onSubmit: (
    data: Omit<
      Match,
      "id" |
      "createdAt" |
      "updatedAt"
    >
  ) => Promise<void>
): void {

  const form =
    document.getElementById(
      "matchForm"
    );


  if (
    !(form instanceof HTMLFormElement)
  ) {

    return;

  }


  // ==========================================================
  // SUBMIT
  // ==========================================================

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const fullname =
        getFormValue(
          form,
          "fullname"
        );


      if (!fullname) {

        alert(
          "Full Name is required."
        );


        return;

      }


      const data: Omit<
        Match,
        "id" |
        "createdAt" |
        "updatedAt"
      > = {

        fullname,

        firstname:
          getFormValue(
            form,
            "firstname"
          ),

        middlename:
          getFormValue(
            form,
            "middlename"
          ),

        lastname:
          getFormValue(
            form,
            "lastname"
          ),

        ancestralsurname:
          getFormValue(
            form,
            "ancestralsurname"
          ),

        ydnahaplogroup:
          getFormValue(
            form,
            "ydnahaplogroup"
          ),

        ydnasubclade:
          getFormValue(
            form,
            "ydnasubclade"
          ),

        mtdna:
          getFormValue(
            form,
            "mtdna"
          ),

        pays:
          getFormValue(
            form,
            "pays"
          ),

        region:
          getFormValue(
            form,
            "region"
          ),

        province:
          getFormValue(
            form,
            "province"
          ),

        commun:
          getFormValue(
            form,
            "commun"
          ),

        tribe:
          getFormValue(
            form,
            "tribe"
          ),

        details:
          getFormValue(
            form,
            "details"
          ),

      };


      await onSubmit(
        data
      );

    }
  );


  // ==========================================================
  // CANCEL
  // ==========================================================

  const cancelButton =
    document.getElementById(
      "cancelMatchButton"
    );


  cancelButton?.addEventListener(
    "click",
    async () => {

      await renderMatches(
        currentMatchesPage
      );

    }
  );

}


// ============================================================
// DELETE MATCH
// ============================================================

async function handleDeleteMatch(
  id: number
): Promise<void> {

  const confirmed =
    window.confirm(
      `Are you sure you want to delete match #${id}?`
    );


  if (!confirmed) {

    return;

  }


  try {

    await deleteMatch(
      id
    );


    /*
     * If we deleted the only record
     * on the current page,
     * go to previous page.
     */

    if (
      matches.length === 1 &&
      currentMatchesPage > 1
    ) {

      currentMatchesPage--;

    }


    await renderMatches(
      currentMatchesPage
    );


  } catch (error) {

    console.error(
      "Delete match error:",
      error
    );


    alert(
      error instanceof Error
        ? error.message
        : "Failed to delete match"
    );

  }

}


// ============================================================
// NAVIGATION
// ============================================================

function setupNavigation(): void {

  const navItems =
    document.querySelectorAll<HTMLButtonElement>(
      ".nav-item"
    );


  navItems.forEach(
    (item) => {

      item.addEventListener(
        "click",
        async () => {

          const page =
            item.dataset.page;


          if (!page) {

            return;

          }


          // Remove active

          navItems.forEach(
            (nav) => {

              nav.classList.remove(
                "active"
              );

            }
          );


          // Add active

          item.classList.add(
            "active"
          );


          // ==================================================
          // DASHBOARD
          // ==================================================

          if (
            page === "dashboard"
          ) {

            await renderDashboard();

            return;

          }


          // ==================================================
          // MATCHES
          // ==================================================

          if (
            page === "matches"
          ) {

            currentMatchesPage =
              1;


            await renderMatches(
              1
            );

          }

        }
      );

    }
  );

}


// ============================================================
// INIT
// ============================================================

async function init(): Promise<void> {

  console.log(
    "DNA Matches started"
  );


  setupNavigation();


  await renderDashboard();

}


// ============================================================
// START
// ============================================================

init().catch(
  (error) => {

    console.error(
      "Application initialization failed:",
      error
    );

  }
);
