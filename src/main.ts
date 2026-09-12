import "./styles.css";

import type { Match } from "./types/match";

import {
  getMatches,
  createMatch,
  updateMatch,
  deleteMatch,
} from "./services/matchService";


interface Page {
  title: string;
  description: string;
}


const pages: Record<string, Page> = {

  dashboard: {
    title: "Dashboard",
    description:
      "Overview of your DNA matches",
  },

  matches: {
    title: "Matches",
    description:
      "Manage your DNA matches",
  },

};


const pageTitle =
  document.getElementById(
    "pageTitle"
  );

const pageDescription =
  document.getElementById(
    "pageDescription"
  );

const pageContent =
  document.getElementById(
    "pageContent"
  );

const navigationItems =
  document.querySelectorAll<HTMLButtonElement>(
    ".nav-item"
  );


/* =========================
   DASHBOARD
   ========================= */

function renderDashboard(): void {

  if (!pageContent) {
    return;
  }


  const matches =
    getMatches();


  pageContent.innerHTML = `

    <div class="page-header">

      <div>

        <h2>Dashboard</h2>

        <p>
          Overview of your DNA matches
        </p>

      </div>

    </div>


    <div class="stats-grid">

      <div class="stat-card">

        <span class="stat-label">
          Total Matches
        </span>

        <strong class="stat-value">
          ${matches.length}
        </strong>

      </div>


      <div class="stat-card">

        <span class="stat-label">
          Y-DNA Haplogroups
        </span>

        <strong class="stat-value">

          ${
            new Set(
              matches
                .map(
                  (match) =>
                    match.ydnahaplogroup
                )
                .filter(Boolean)
            ).size
          }

        </strong>

      </div>


      <div class="stat-card">

        <span class="stat-label">
          mtDNA
        </span>

        <strong class="stat-value">

          ${
            new Set(
              matches
                .map(
                  (match) =>
                    match.mtdna
                )
                .filter(Boolean)
            ).size
          }

        </strong>

      </div>

    </div>

  `;
}


/* =========================
   MATCHES LIST
   ========================= */

function renderMatches(): void {

  if (!pageContent) {
    return;
  }


  const matches =
    getMatches();


  pageContent.innerHTML = `

    <div class="page-header">

      <div>

        <h2>DNA Matches</h2>

        <p>
          Manage your DNA matches
        </p>

      </div>


      <button
        id="addMatchButton"
        class="primary-button"
      >
        + Add Match
      </button>

    </div>


    <div class="table-card">

      <table>

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

          ${
            matches.length === 0

              ? `

                <tr>

                  <td
                    colspan="9"
                    class="empty-state"
                  >

                    No DNA matches yet.

                  </td>

                </tr>

              `

              : matches
                  .map(
                    renderMatchRow
                  )
                  .join("")
          }

        </tbody>

      </table>

    </div>

  `;


  document
    .getElementById(
      "addMatchButton"
    )
    ?.addEventListener(
      "click",
      () => {

        showMatchForm();

      }
    );


  document
    .querySelectorAll<HTMLButtonElement>(
      ".edit-match"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(
                button.dataset.id
              );

            showMatchForm(id);

          }
        );

      }
    );


  document
    .querySelectorAll<HTMLButtonElement>(
      ".delete-match"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(
                button.dataset.id
              );

            handleDeleteMatch(id);

          }
        );

      }
    );

}


/* =========================
   MATCH ROW
   ========================= */

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

        <div class="actions">

          <button
            class="action-button edit-match"
            data-id="${match.id}"
          >
            Edit
          </button>


          <button
            class="action-button delete-match"
            data-id="${match.id}"
          >
            Delete
          </button>

        </div>

      </td>

    </tr>

  `;
}


/* =========================
   ADD / UPDATE FORM
   ========================= */

function showMatchForm(
  matchId?: number
): void {

  const match =
    matchId !== undefined
      ? getMatches().find(
          (item) =>
            item.id === matchId
        )
      : undefined;


  const isEdit =
    Boolean(match);


  if (!pageContent) {
    return;
  }


  pageContent.innerHTML = `

    <div class="page-header">

      <div>

        <h2>
          ${
            isEdit
              ? "Update Match"
              : "Add Match"
          }
        </h2>

        <p>
          ${
            isEdit
              ? "Update DNA match information"
              : "Add a new DNA match"
          }
        </p>

      </div>

    </div>


    <div class="form-card">

      <form id="matchForm">


        <!-- =================
             PERSONAL INFO
        ================== -->

        <h3>Personal Information</h3>


        <div class="form-grid">


          <div class="form-group">

            <label for="fullname">
              Full Name
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


        <!-- =================
             DNA
        ================== -->

        <h3>DNA Information</h3>


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


        <!-- =================
             LOCATION
        ================== -->

        <h3>Location</h3>


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


        <!-- =================
             DETAILS
        ================== -->

        <h3>Details</h3>


        <div class="form-group">

          <label for="details">
            Details
          </label>

          <textarea
            id="details"
            name="details"
            rows="6"
          >${escapeHtml(
            match?.details ?? ""
          )}</textarea>

        </div>


        <!-- =================
             ACTIONS
        ================== -->

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
            id="cancelButton"
            class="secondary-button"
          >

            Cancel

          </button>

        </div>


      </form>

    </div>

  `;


  const form =
    document.getElementById(
      "matchForm"
    ) as HTMLFormElement | null;


  form?.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const formData =
        new FormData(form);


      const data: Omit<
        Match,
        "id" | "createdAt" | "updatedAt"
      > = {

        fullname:
          String(
            formData.get(
              "fullname"
            ) ?? ""
          ).trim(),

        firstname:
          String(
            formData.get(
              "firstname"
            ) ?? ""
          ).trim(),

        middlename:
          String(
            formData.get(
              "middlename"
            ) ?? ""
          ).trim(),

        lastname:
          String(
            formData.get(
              "lastname"
            ) ?? ""
          ).trim(),

        ancestralsurname:
          String(
            formData.get(
              "ancestralsurname"
            ) ?? ""
          ).trim(),

        ydnahaplogroup:
          String(
            formData.get(
              "ydnahaplogroup"
            ) ?? ""
          ).trim(),

        ydnasubclade:
          String(
            formData.get(
              "ydnasubclade"
            ) ?? ""
          ).trim(),

        mtdna:
          String(
            formData.get(
              "mtdna"
            ) ?? ""
          ).trim(),

        pays:
          String(
            formData.get(
              "pays"
            ) ?? ""
          ).trim(),

        region:
          String(
            formData.get(
              "region"
            ) ?? ""
          ).trim(),

        province:
          String(
            formData.get(
              "province"
            ) ?? ""
          ).trim(),

        commun:
          String(
            formData.get(
              "commun"
            ) ?? ""
          ).trim(),

        tribe:
          String(
            formData.get(
              "tribe"
            ) ?? ""
          ).trim(),

        details:
          String(
            formData.get(
              "details"
            ) ?? ""
          ).trim(),

      };


      if (
        isEdit &&
        match
      ) {

        updateMatch(
          match.id,
          data
        );

      } else {

        createMatch(
          data
        );

      }


      renderMatches();

    }
  );


  document
    .getElementById(
      "cancelButton"
    )
    ?.addEventListener(
      "click",
      () => {

        renderMatches();

      }
    );

}


/* =========================
   DELETE
   ========================= */

function handleDeleteMatch(
  id: number
): void {

  const match =
    getMatches().find(
      (item) =>
        item.id === id
    );


  if (!match) {
    return;
  }


  const confirmed =
    confirm(
      `Delete match "${match.fullname}"?`
    );


  if (!confirmed) {
    return;
  }


  deleteMatch(id);

  renderMatches();

}


/* =========================
   NAVIGATION
   ========================= */

function changePage(
  pageName: string
): void {

  const page =
    pages[pageName];


  if (!page) {
    return;
  }


  if (pageTitle) {
    pageTitle.textContent =
      page.title;
  }


  if (pageDescription) {
    pageDescription.textContent =
      page.description;
  }


  navigationItems.forEach(
    (item) => {

      item.classList.toggle(
        "active",
        item.dataset.page ===
          pageName
      );

    }
  );


  switch (pageName) {

    case "dashboard":

      renderDashboard();

      break;


    case "matches":

      renderMatches();

      break;

  }

}


navigationItems.forEach(
  (item) => {

    item.addEventListener(
      "click",
      () => {

        const pageName =
          item.dataset.page;


        if (!pageName) {
          return;
        }


        changePage(
          pageName
        );

      }
    );

  }
);


/* =========================
   HELPERS
   ========================= */

function escapeHtml(
  value: string | null | undefined
): string {

  return (value ?? "")
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}


function escapeAttribute(
  value: string | null | undefined
): string {

  return escapeHtml(
    value
  );

}



/* =========================
   START
   ========================= */

changePage(
  "dashboard"
);