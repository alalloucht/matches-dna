(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const h="http://localhost:3000/matches";async function $(e=1,t=50){const a=await fetch(`${h}?page=${e}&limit=${t}`);if(!a.ok){const n=await a.json().catch(()=>null);throw new Error((n==null?void 0:n.error)||"Failed to fetch matches")}return a.json()}async function A(e){const t=await fetch(`${h}/${e}`);if(!t.ok){if(t.status===404)throw new Error("Match not found");const a=await t.json().catch(()=>null);throw new Error((a==null?void 0:a.error)||"Failed to fetch match")}return t.json()}async function D(e){const t=await fetch(h,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){const a=await t.json().catch(()=>null);throw new Error((a==null?void 0:a.error)||"Failed to create match")}return t.json()}async function P(e,t){const a=await fetch(`${h}/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok){const n=await a.json().catch(()=>null);throw a.status===404?new Error("Match not found"):new Error((n==null?void 0:n.error)||"Failed to update match")}return a.json()}async function x(e){const t=await fetch(`${h}/${e}`,{method:"DELETE"});if(!t.ok){const a=await t.json().catch(()=>null);throw t.status===404?new Error("Match not found"):new Error((a==null?void 0:a.error)||"Failed to delete match")}}let b=[],u=1;const E=50;let f={page:1,limit:E,total:0,totalPages:0,hasNextPage:!1,hasPreviousPage:!1};const m=document.getElementById("pageTitle"),v=document.getElementById("pageDescription"),l=document.getElementById("pageContent");function p(e){return e===null?"":e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function s(e){return e===null?"":e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function y(){l&&(l.innerHTML=`
    <div class="loading">
      Loading...
    </div>
  `)}function w(e){l&&(l.innerHTML=`
    <div class="error-message">
      ${p(e)}
    </div>
  `)}async function M(){if(!(!m||!v||!l)){m.textContent="Dashboard",v.textContent="Overview of your DNA matches",y();try{const t=(await $(1,1)).pagination.total;l.innerHTML=`
      <div class="page-header">
        <div>
          <h3>Dashboard</h3>
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
            ${t.toLocaleString()}
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
    `}catch(e){console.error("Dashboard error:",e),w(e instanceof Error?e.message:"Failed to load dashboard")}}}async function g(e=u){if(!(!m||!v||!l)){m.textContent="Matches",v.textContent="Manage your DNA matches",y();try{const t=await $(e,E);b=t.data,f=t.pagination,u=t.pagination.page,F()}catch(t){console.error("Matches error:",t),w(t instanceof Error?t.message:"Failed to load matches")}}}function F(){if(!l)return;const e=f.total,t=f.page,a=f.limit;let n=0,r=0;e>0&&(n=(t-1)*a+1,r=Math.min(t*a,e)),l.innerHTML=`

    <div class="page-header">

      <div>
        <h3>DNA Matches</h3>

        <p>
          Showing
          ${n.toLocaleString()}
          –
          ${r.toLocaleString()}
          of
          ${e.toLocaleString()}
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


    ${b.length===0?`
          <div class="empty-state">
            No matches found.
          </div>
        `:`

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

                ${b.map(I).join("")}

              </tbody>

            </table>

          </div>

        `}


    ${T()}

  `;const o=document.getElementById("addMatchButton");o==null||o.addEventListener("click",()=>{S()}),document.querySelectorAll(".edit-match-button").forEach(d=>{d.addEventListener("click",async()=>{const c=Number(d.dataset.id);Number.isInteger(c)&&await O(c)})}),document.querySelectorAll(".delete-match-button").forEach(d=>{d.addEventListener("click",async()=>{const c=Number(d.dataset.id);Number.isInteger(c)&&await C(c)})}),document.querySelectorAll(".pagination-button").forEach(d=>{d.addEventListener("click",async()=>{const c=Number(d.dataset.page);Number.isInteger(c)&&(c<1||c>f.totalPages||(u=c,await g(c)))})})}function I(e){return`
    <tr>

      <td>
        ${e.id}
      </td>

      <td>
        ${p(e.fullname)}
      </td>

      <td>
        ${p(e.ydnahaplogroup)}
      </td>

      <td>
        ${p(e.ydnasubclade)}
      </td>

      <td>
        ${p(e.mtdna)}
      </td>

      <td>
        ${p(e.pays)}
      </td>

      <td>
        ${p(e.region)}
      </td>

      <td>
        ${p(e.province)}
      </td>

      <td>

        <div class="action-buttons">

          <button
            class="action-button edit-match-button"
            data-id="${e.id}"
          >
            Edit
          </button>

          <button
            class="action-button delete-match-button"
            data-id="${e.id}"
          >
            Delete
          </button>

        </div>

      </td>

    </tr>
  `}function T(){const e=f.totalPages,t=f.page;if(e<=1)return"";const a=[];if(e<=7)for(let n=1;n<=e;n++)a.push(n);else a.push(1),t<=4?(a.push(2),a.push(3),a.push(4),a.push(5),a.push("ellipsis"),a.push(e)):t>=5&&t<=e-4?(a.push("ellipsis"),a.push(t-1),a.push(t),a.push(t+1),a.push("ellipsis"),a.push(e)):(a.push("ellipsis"),a.push(e-4),a.push(e-3),a.push(e-2),a.push(e-1),a.push(e));return`

    <div class="pagination-container">

      <div class="pagination-info">

        Page
        ${t.toLocaleString()}
        of
        ${e.toLocaleString()}

      </div>


      <div class="pagination">


        <!-- PREVIOUS -->

        <button
          class="pagination-button"
          data-page="${t-1}"
          ${f.hasPreviousPage?"":"disabled"}
        >
          Previous
        </button>


        <!-- PAGE NUMBERS -->

        ${a.map(n=>n==="ellipsis"?`
                <span class="pagination-ellipsis">
                  ...
                </span>
              `:`

              <button
                class="
                  pagination-button
                  ${n===t?"active":""}
                "
                data-page="${n}"
              >
                ${n}
              </button>

            `).join("")}


        <!-- NEXT -->

        <button
          class="pagination-button"
          data-page="${t+1}"
          ${f.hasNextPage?"":"disabled"}
        >
          Next
        </button>


      </div>

    </div>

  `}function S(){!m||!v||!l||(m.textContent="Add Match",v.textContent="Create a new DNA match",l.innerHTML=N(),L(async e=>{try{await D(e),u=1,await g(1)}catch(t){alert(t instanceof Error?t.message:"Failed to create match")}}))}async function O(e){if(!(!m||!v||!l)){m.textContent="Edit Match",v.textContent="Update DNA match information",y();try{const t=await A(e);l.innerHTML=N(t),L(async a=>{try{await P(e,a),await g(u)}catch(n){alert(n instanceof Error?n.message:"Failed to update match")}})}catch(t){console.error("Edit match error:",t),w(t instanceof Error?t.message:"Failed to load match")}}}function N(e){const t=!!e;return`

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
              value="${s((e==null?void 0:e.fullname)??"")}"
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
              value="${s((e==null?void 0:e.firstname)??"")}"
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
              value="${s((e==null?void 0:e.middlename)??"")}"
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
              value="${s((e==null?void 0:e.lastname)??"")}"
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
              value="${s((e==null?void 0:e.ancestralsurname)??"")}"
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
              value="${s((e==null?void 0:e.ydnahaplogroup)??"")}"
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
              value="${s((e==null?void 0:e.ydnasubclade)??"")}"
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
              value="${s((e==null?void 0:e.mtdna)??"")}"
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
              value="${s((e==null?void 0:e.pays)??"")}"
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
              value="${s((e==null?void 0:e.region)??"")}"
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
              value="${s((e==null?void 0:e.province)??"")}"
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
              value="${s((e==null?void 0:e.commun)??"")}"
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
              value="${s((e==null?void 0:e.tribe)??"")}"
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
          >${p((e==null?void 0:e.details)??"")}</textarea>

        </div>

      </div>


      <!-- ================================================= -->
      <!-- FORM ACTIONS -->
      <!-- ================================================= -->

      <div class="form-actions">

        <button
          type="submit"
          class="primary-button"
        >
          ${t?"Update Match":"Create Match"}
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

  `}function i(e,t){const a=e.elements.namedItem(t);if(!(a instanceof HTMLInputElement)&&!(a instanceof HTMLTextAreaElement)&&!(a instanceof HTMLSelectElement))return null;const n=a.value.trim();return n===""?null:n}function L(e){const t=document.getElementById("matchForm");if(!(t instanceof HTMLFormElement))return;t.addEventListener("submit",async n=>{n.preventDefault();const r=i(t,"fullname");if(!r){alert("Full Name is required.");return}const o={fullname:r,firstname:i(t,"firstname"),middlename:i(t,"middlename"),lastname:i(t,"lastname"),ancestralsurname:i(t,"ancestralsurname"),ydnahaplogroup:i(t,"ydnahaplogroup"),ydnasubclade:i(t,"ydnasubclade"),mtdna:i(t,"mtdna"),pays:i(t,"pays"),region:i(t,"region"),province:i(t,"province"),commun:i(t,"commun"),tribe:i(t,"tribe"),details:i(t,"details")};await e(o)});const a=document.getElementById("cancelMatchButton");a==null||a.addEventListener("click",async()=>{await g(u)})}async function C(e){if(window.confirm(`Are you sure you want to delete match #${e}?`))try{await x(e),b.length===1&&u>1&&u--,await g(u)}catch(a){console.error("Delete match error:",a),alert(a instanceof Error?a.message:"Failed to delete match")}}function j(){const e=document.querySelectorAll(".nav-item");e.forEach(t=>{t.addEventListener("click",async()=>{const a=t.dataset.page;if(a){if(e.forEach(n=>{n.classList.remove("active")}),t.classList.add("active"),a==="dashboard"){await M();return}if(a==="matches"){u=1,await g(1);return}}})})}async function H(){console.log("DNA Matches started"),j(),await M()}H().catch(e=>{console.error("Application initialization failed:",e)});
