import "./styles.css";

import type { Match } from "./types/match";

import {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getMatchStats,
  getRecentMatches,
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

type Language = "en" | "ar";

let currentLanguage: Language =
  localStorage.getItem("dna-matches-language") === "ar"
    ? "ar"
    : "en";

const translations: Record<string, string> = {
  "DNA Management": "إدارة الحمض النووي",
  "Dashboard": "لوحة التحكم",
  "Matches": "المطابقات",
  "Overview of your DNA matches": "نظرة عامة على مطابقات الحمض النووي",
  "Loading...": "جار التحميل...",
  "Overview of your DNA matches database.": "نظرة عامة على قاعدة بيانات مطابقات الحمض النووي.",
  "Total Matches": "إجمالي المطابقات",
  "Added Today": "أضيفت اليوم",
  "Added This Week": "أضيفت هذا الأسبوع",
  "Added This Month": "أضيفت هذا الشهر",
  "Database": "قاعدة البيانات",
  "MySQL Connected": "متصل بـ MySQL",
  "Recent Matches": "أحدث المطابقات",
  "Latest matches added to the database.": "آخر المطابقات المضافة إلى قاعدة البيانات.",
  "View All Matches": "عرض كل المطابقات",
  "No recent matches found.": "لم يتم العثور على مطابقات حديثة.",
  "No matches found.": "لم يتم العثور على مطابقات.",
  "Search, filter and manage your DNA matches": "ابحث وصفِّ وأدر مطابقات الحمض النووي",
  "DNA Matches": "مطابقات الحمض النووي",
  "+ Add Match": "+ إضافة مطابقة",
  "Search": "بحث",
  "Search name, haplogroup, mtDNA...": "ابحث بالاسم أو المجموعة الفردانية أو mtDNA...",
  "Country": "البلد",
  "Region": "الجهة",
  "Province": "الإقليم",
  "Y-DNA Haplogroup": "المجموعة الفردانية Y-DNA",
  "Y-DNA Subclade": "السلالة الفرعية Y-DNA",
  "Tribe": "القبيلة",
  "Apply Filters": "تطبيق الفلاتر",
  "Clear Filters": "مسح الفلاتر",
  "Add Match": "إضافة مطابقة",
  "Create a new DNA match": "إنشاء مطابقة جديدة للحمض النووي",
  "Edit Match": "تعديل المطابقة",
  "Update DNA match information": "تحديث معلومات مطابقة الحمض النووي",
  "Save": "حفظ",
  "Cancel": "إلغاء",
  "Delete": "حذف",
  "Details": "التفاصيل",
  "Not provided": "غير متوفر",
  "Match ID": "معرّف المطابقة",
  "Full Name": "الاسم الكامل",
  "First Name": "الاسم الأول",
  "Middle Name": "الاسم الأوسط",
  "Last Name": "اسم العائلة",
  "Ancestral Surname": "اسم العائلة الأصلي",
  "mtDNA": "mtDNA",
  "Commune": "الجماعة",
  "Created": "تاريخ الإنشاء",
  "Updated": "تاريخ التحديث",
};

const arabicToEnglish = Object.fromEntries(
  Object.entries(translations).map(([english, arabic]) => [arabic, english])
);

function translateText(value: string): string {
  const englishValue = arabicToEnglish[value] ?? value;
  return currentLanguage === "ar"
    ? translations[englishValue] ?? englishValue
    : englishValue;
}

function applyLanguage(): void {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node = walker.nextNode();

  while (node) {
    if (!node.parentElement?.closest("script, style")) {
      textNodes.push(node as Text);
    }
    node = walker.nextNode();
  }

  textNodes.forEach((textNode) => {
    const value = textNode.textContent?.trim() ?? "";
    const translated = translateText(value);
    if (value && value !== translated) {
      textNode.textContent = textNode.textContent?.replace(value, translated) ?? "";
    }
  });

  document.querySelectorAll<HTMLInputElement>("[placeholder]").forEach((input) => {
    input.placeholder = translateText(input.getAttribute("placeholder") ?? "");
  });

  const languageToggle = document.getElementById("languageToggle");
  if (languageToggle) {
    languageToggle.textContent = currentLanguage === "ar" ? "English" : "العربية";
    languageToggle.setAttribute(
      "aria-label",
      currentLanguage === "ar" ? "Switch to English" : "التبديل إلى العربية"
    );
  }
}


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
// DATE HELPERS
// ============================================================

function formatDate(
  value: string
): string {

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }

  return date.toLocaleString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

}


// ============================================================
// NUMBER HELPERS
// ============================================================

function formatNumber(
  value: number
): string {

  return value.toLocaleString();

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

  applyLanguage();
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

    // ========================================================
    // LOAD DASHBOARD DATA
    // ========================================================

    const [
      stats,
      recentMatches,
    ] = await Promise.all([

      getMatchStats(),

      getRecentMatches(10),

    ]);


    // ========================================================
    // DASHBOARD HTML
    // ========================================================

    pageContent.innerHTML = `

      <!-- ================================================= -->
      <!-- PAGE HEADER -->
      <!-- ================================================= -->

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


      <!-- ================================================= -->
      <!-- STATISTICS -->
      <!-- ================================================= -->

      <div class="dashboard-grid">


        <!-- TOTAL -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Total Matches
          </div>

          <div class="dashboard-card-value">
            ${formatNumber(stats.total)}
          </div>

        </div>


        <!-- TODAY -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Added Today
          </div>

          <div class="dashboard-card-value">
            ${formatNumber(stats.today)}
          </div>

        </div>


        <!-- THIS WEEK -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Added This Week
          </div>

          <div class="dashboard-card-value">
            ${formatNumber(stats.thisWeek)}
          </div>

        </div>


        <!-- THIS MONTH -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Added This Month
          </div>

          <div class="dashboard-card-value">
            ${formatNumber(stats.thisMonth)}
          </div>

        </div>


      </div>


      <!-- ================================================= -->
      <!-- DATABASE / API STATUS -->
      <!-- ================================================= -->

      <div class="dashboard-status-grid">


        <div class="dashboard-status-card">

          <div class="dashboard-status-label">
            Database
          </div>

          <div class="dashboard-status-value">
            <span class="status-dot"></span>
            MySQL Connected
          </div>

        </div>


        <div class="dashboard-status-card">

          <div class="dashboard-status-label">
            API
          </div>

          <div class="dashboard-status-value">
            <span class="status-dot"></span>
            Online
          </div>

        </div>


      </div>


      <!-- ================================================= -->
      <!-- RECENT MATCHES -->
      <!-- ================================================= -->

      <div class="dashboard-section">


        <div class="dashboard-section-header">

          <div>

            <h3>
              Recent Matches
            </h3>

            <p>
              Latest matches added to the database.
            </p>

          </div>


          <button
            id="viewAllMatchesButton"
            class="secondary-button"
            type="button"
          >
            View All Matches
          </button>

        </div>


        ${
          recentMatches.length === 0

            ? `

              <div class="empty-state">

                No recent matches found.

              </div>

            `

            : `

              <div class="table-container">

                <table class="matches-table dashboard-recent-table">

                  <thead>

                    <tr>

                      <th>ID</th>

                      <th>Full Name</th>

                      <th>Y-DNA</th>

                      <th>Y-DNA Subclade</th>

                      <th>mtDNA</th>

                      <th>Country</th>

                      <th>Created</th>

                    </tr>

                  </thead>


                  <tbody>

                    ${recentMatches
                      .map(
                        renderRecentMatchRow
                      )
                      .join("")}

                  </tbody>

                </table>

              </div>

            `

        }


      </div>

    `;


    // ========================================================
    // VIEW ALL MATCHES
    // ========================================================

    const viewAllButton =
      document.getElementById(
        "viewAllMatchesButton"
      );


    viewAllButton?.addEventListener(
      "click",
      async () => {

        activateNavigation(
          "matches"
        );

        currentMatchesPage = 1;

        await renderMatches(
          1
        );

      }
    );


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
// RECENT MATCH ROW
// ============================================================

function renderRecentMatchRow(
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
        ${formatDate(
          match.createdAt ?? ""
        )}
      </td>

    </tr>

  `;

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


  // ==========================================================
  // REMOVE EMPTY VALUES
  // ==========================================================

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


  // ==========================================================
  // RESET PAGE
  // ==========================================================

  currentMatchesPage = 1;


  void renderMatches(
    1
  );

}


// ============================================================
// CLEAR FILTERS
// ============================================================

function clearFilters(): void {

  currentFilters = {};

  currentMatchesPage = 1;

  void renderMatches(
    1
  );

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


            await renderEditMatchForm(
              id
            );

          }
        );

      }
    );


  // ==========================================================
  // VIEW
  // ==========================================================

  document
    .querySelectorAll<HTMLButtonElement>(
      ".view-match-button"
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


            await showMatchDetails(
              id
            );

          }
        );

      }
    );


  // ==========================================================
  // EXPORT
  // ==========================================================

  document
    .querySelectorAll<HTMLButtonElement>(
      ".export-match-button"
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


            await exportMatchImage(
              id
            );

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


            await handleDeleteMatch(
              id
            );

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
            class="action-button view-match-button"
            data-id="${match.id}"
          >
            Consulter
          </button>


          <button
            class="action-button export-match-button"
            data-id="${match.id}"
          >
            Export
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
// MATCH DETAILS MODAL
// ============================================================

async function showMatchDetails(
  id: number
): Promise<void> {

  try {

    const match =
      await getMatchById(
        id
      );


    const modal =
      document.createElement(
        "div"
      );


    modal.className =
      "match-modal-backdrop";

    modal.innerHTML =
      renderMatchDetailsModal(
        match
      );


    document.body.appendChild(
      modal
    );


    const close = (): void => {

      modal.remove();

    };


    modal
      .querySelector(
        ".match-modal-close"
      )
      ?.addEventListener(
        "click",
        close
      );


    modal.addEventListener(
      "click",
      (event) => {

        if (
          event.target === modal
        ) {

          close();

        }

      }
    );


    document.addEventListener(
      "keydown",
      function handleEscape(event) {

        if (
          event.key === "Escape"
        ) {

          close();
          document.removeEventListener(
            "keydown",
            handleEscape
          );

        }

      }
    );

  } catch (error) {

    alert(
      error instanceof Error
        ? error.message
        : "Failed to load match details"
    );

  }

}


function renderMatchDetailsModal(
  match: Match
): string {

  const fields: Array<[string, string | null]> = [
    ["Match ID", String(match.id)],
    ["Full Name", match.fullname],
    ["First Name", match.firstname],
    ["Middle Name", match.middlename],
    ["Last Name", match.lastname],
    ["Ancestral Surname", match.ancestralsurname],
    ["Y-DNA Haplogroup", match.ydnahaplogroup],
    ["Y-DNA Subclade", match.ydnasubclade],
    ["mtDNA", match.mtdna],
    ["Country", match.pays],
    ["Region", match.region],
    ["Province", match.province],
    ["Commune", match.commun],
    ["Tribe", match.tribe],
    ["Created", match.createdAt ? formatDate(match.createdAt) : null],
    ["Updated", match.updatedAt ? formatDate(match.updatedAt) : null],
  ];


  return `

    <div class="match-modal" role="dialog" aria-modal="true" aria-labelledby="matchModalTitle">

      <div class="match-modal-header">
        <div>
          <span class="match-modal-kicker">DNA MATCH</span>
          <h2 id="matchModalTitle">${escapeHtml(match.fullname)}</h2>
        </div>

        <button class="match-modal-close" type="button" aria-label="Close details">&times;</button>
      </div>

      <div class="match-detail-grid">
        ${fields
          .map(
            ([label, value]) => `
              <div class="match-detail-item">
                <span>${label}</span>
                <strong>${escapeHtml(value ?? "Not provided")}</strong>
              </div>
            `
          )
          .join("")}
      </div>

      <div class="match-detail-notes">
        <span>Details</span>
        <p>${escapeHtml(match.details ?? "Not provided")}</p>
      </div>

    </div>

  `;

}


// ============================================================
// MATCH IMAGE EXPORT
// ============================================================

async function exportMatchImage(
  id: number
): Promise<void> {

  try {

    const match =
      await getMatchById(
        id
      );


    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width = 1600;
    canvas.height = 1000;


    const context =
      canvas.getContext(
        "2d"
      );


    if (!context) {

      throw new Error(
        "Image export is not supported"
      );

    }


    drawMatchTree(
      context,
      match
    );


    const link =
      document.createElement(
        "a"
      );

    link.download =
      `dna-match-${match.id}-${match.fullname
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase()}.png`;

    link.href =
      canvas.toDataURL(
        "image/png"
      );

    link.click();

  } catch (error) {

    alert(
      error instanceof Error
        ? error.message
        : "Failed to export match image"
    );

  }

}


function drawMatchTree(
  context: CanvasRenderingContext2D,
  match: Match
): void {

  const ink = "#172335";
  const muted = "#718096";
  const teal = "#0d8f8a";
  const soft = "#e4f5f3";
  const line = "#d2dde8";


  context.fillStyle = "#f6f9fc";
  context.fillRect(0, 0, 1600, 1000);
  context.fillStyle = "#ffffff";
  context.fillRect(70, 60, 1460, 880);

  context.fillStyle = teal;
  context.fillRect(70, 60, 1460, 12);

  context.font = "700 26px Arial";
  context.fillStyle = ink;
  context.fillText("DNA MATCHES", 120, 135);
  context.font = "16px Arial";
  context.fillStyle = muted;
  context.fillText("Family Tree DNA Profile", 120, 165);

  context.font = "700 42px Arial";
  context.fillStyle = ink;
  context.fillText(match.fullname, 120, 260);
  context.font = "18px Arial";
  context.fillStyle = muted;
  context.fillText(`Match #${match.id}`, 120, 295);

  context.strokeStyle = line;
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(800, 320);
  context.lineTo(800, 390);
  context.moveTo(460, 390);
  context.lineTo(1140, 390);
  context.moveTo(460, 390);
  context.lineTo(460, 430);
  context.moveTo(800, 390);
  context.lineTo(800, 430);
  context.moveTo(1140, 390);
  context.lineTo(1140, 430);
  context.stroke();

  const drawCard = (
    x: number,
    title: string,
    values: string[]
  ): void => {

    context.fillStyle = soft;
    context.fillRect(x, 430, 300, 230);
    context.strokeStyle = line;
    context.lineWidth = 2;
    context.strokeRect(x, 430, 300, 230);
    context.fillStyle = teal;
    context.fillRect(x, 430, 300, 8);
    context.font = "700 20px Arial";
    context.fillStyle = ink;
    context.fillText(title, x + 24, 480);
    context.font = "17px Arial";
    values.forEach(
      (value, index) => {
        context.fillStyle = index === 0 ? ink : muted;
        context.fillText(value, x + 24, 525 + index * 34);
      }
    );

  };


  drawCard(
    310,
    "Y-DNA LINE",
    [
      match.ydnahaplogroup || "Haplogroup not provided",
      match.ydnasubclade || "Subclade not provided",
    ]
  );

  drawCard(
    650,
    "mtDNA LINE",
    [
      match.mtdna || "mtDNA not provided",
      "Maternal DNA profile",
    ]
  );

  drawCard(
    990,
    "ORIGIN",
    [
      [match.pays, match.region].filter(Boolean).join(", ") || "Location not provided",
      [match.province, match.commun].filter(Boolean).join(", ") || "Locality not provided",
    ]
  );

  context.font = "700 18px Arial";
  context.fillStyle = muted;
  context.fillText("Family details", 120, 755);
  context.font = "18px Arial";
  context.fillStyle = ink;
  const details = match.details || "No additional details provided";
  context.fillText(details.slice(0, 115), 120, 795);

  context.font = "14px Arial";
  context.fillStyle = muted;
  context.fillText("Exported from DNA MATCHES", 120, 885);

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


    // ========================================================
    // NEAR BEGINNING
    // ========================================================

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


    // ========================================================
    // MIDDLE
    // ========================================================

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


    // ========================================================
    // NEAR END
    // ========================================================

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


        // New match gets latest ID,
        // so go to page 1.

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


    // If we deleted the only record
    // on the current page,
    // go to previous page.

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

function activateNavigation(
  page: string
): void {

  const navItems =
    document.querySelectorAll<HTMLButtonElement>(
      ".nav-item"
    );


  navItems.forEach(
    (nav) => {

      nav.classList.toggle(
        "active",
        nav.dataset.page === page
      );

    }
  );

}


// ============================================================
// SETUP NAVIGATION
// ============================================================

function setupNavigation(): void {

  const navItems =
    document.querySelectorAll<HTMLButtonElement>(
      ".nav-item"
    );

  document.getElementById("languageToggle")?.addEventListener("click", () => {
    currentLanguage = currentLanguage === "ar" ? "en" : "ar";
    localStorage.setItem("dna-matches-language", currentLanguage);
    applyLanguage();

    const activePage =
      document.querySelector<HTMLButtonElement>(".nav-item.active")?.dataset.page;

    if (activePage === "matches") {
      void renderMatches(currentMatchesPage);
    } else {
      void renderDashboard();
    }
  });

  applyLanguage();


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


          // ==================================================
          // ACTIVE NAVIGATION
          // ==================================================

          activateNavigation(
            page
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

  if (pageContent) {
    const languageObserver = new MutationObserver(() => applyLanguage());
    languageObserver.observe(pageContent, { childList: true, subtree: true });
  }


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