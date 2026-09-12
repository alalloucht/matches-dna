(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const f of r.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&o(f)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();const p="http://localhost:3000/matches";async function $(){const e=await fetch(p);if(!e.ok)throw new Error("Failed to fetch matches");return e.json()}async function F(e){const t=await fetch(`${p}/${e}`);if(!t.ok)throw t.status===404?new Error("Match not found"):new Error("Failed to fetch match");return t.json()}async function L(e){const t=await fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){const a=await t.json().catch(()=>null);throw new Error((a==null?void 0:a.error)||"Failed to create match")}return t.json()}async function B(e,t){const a=await fetch(`${p}/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok){const o=await a.json().catch(()=>null);throw a.status===404?new Error("Match not found"):new Error((o==null?void 0:o.error)||"Failed to update match")}return a.json()}async function I(e){const t=await fetch(`${p}/${e}`,{method:"DELETE"});if(!t.ok){const a=await t.json().catch(()=>null);throw t.status===404?new Error("Match not found"):new Error((a==null?void 0:a.error)||"Failed to delete match")}}console.log("DNA Matches started");const w=document.getElementById("pageTitle"),M=document.getElementById("pageDescription"),c=document.getElementById("pageContent"),A=document.querySelectorAll(".nav-item");let N="dashboard",l=[],u=null;function s(e){return e===null?"":e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function i(e){return e===null?"":e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function m(e,t){w&&(w.textContent=e),M&&(M.textContent=t)}function D(){c&&(c.innerHTML=`
    <div class="loading">
      <p>Loading...</p>
    </div>
  `)}function b(e){var t;c&&(c.innerHTML=`
    <div class="error-message">
      <h3>Erreur</h3>
      <p>${s(e)}</p>

      <button
        class="btn btn-primary"
        id="retryButton"
      >
        Réessayer
      </button>
    </div>
  `,(t=document.getElementById("retryButton"))==null||t.addEventListener("click",()=>{g(N)}))}async function E(){var e;m("Dashboard","Overview of your DNA matches"),D();try{l=await $();const t=l.length,a=new Set(l.map(r=>r.pays).filter(r=>!!r)),o=new Set(l.map(r=>r.ydnahaplogroup).filter(r=>!!r)),n=new Set(l.map(r=>r.mtdna).filter(r=>!!r));if(!c)return;c.innerHTML=`
      <div class="page-header">
        <div>
          <h3>Dashboard</h3>
          <p>Overview of your DNA database</p>
        </div>

        <button
          class="btn btn-primary"
          id="goToMatchesButton"
        >
          View Matches
        </button>
      </div>

      <div class="dashboard-grid">

        <div class="dashboard-card">
          <div class="dashboard-card-title">
            Total Matches
          </div>

          <div class="dashboard-card-value">
            ${t}
          </div>

          <div class="dashboard-card-description">
            DNA matches in database
          </div>
        </div>

        <div class="dashboard-card">
          <div class="dashboard-card-title">
            Countries
          </div>

          <div class="dashboard-card-value">
            ${a.size}
          </div>

          <div class="dashboard-card-description">
            Different countries
          </div>
        </div>

        <div class="dashboard-card">
          <div class="dashboard-card-title">
            Y-DNA Groups
          </div>

          <div class="dashboard-card-value">
            ${o.size}
          </div>

          <div class="dashboard-card-description">
            Haplogroups
          </div>
        </div>

        <div class="dashboard-card">
          <div class="dashboard-card-title">
            mtDNA Groups
          </div>

          <div class="dashboard-card-value">
            ${n.size}
          </div>

          <div class="dashboard-card-description">
            mtDNA groups
          </div>
        </div>

      </div>

      <div class="dashboard-section">
        <div class="section-header">
          <h3>Recent Matches</h3>
        </div>

        ${l.length===0?`
              <div class="empty-state">
                <p>No matches found.</p>
              </div>
            `:`
              <div class="table-container">
                <table class="matches-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Y-DNA</th>
                      <th>mtDNA</th>
                      <th>Country</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${l.slice(0,5).map(r=>`
                          <tr>
                            <td>${r.id}</td>

                            <td>
                              ${s(r.fullname)}
                            </td>

                            <td>
                              ${s(r.ydnahaplogroup)}
                            </td>

                            <td>
                              ${s(r.mtdna)}
                            </td>

                            <td>
                              ${s(r.pays)}
                            </td>
                          </tr>
                        `).join("")}
                  </tbody>
                </table>
              </div>
            `}
      </div>
    `,(e=document.getElementById("goToMatchesButton"))==null||e.addEventListener("click",()=>{y("matches")})}catch(t){console.error(t),b(t instanceof Error?t.message:"Failed to load dashboard")}}async function h(){m("Matches","Manage your DNA matches"),D();try{l=await $(),x()}catch(e){console.error(e),b(e instanceof Error?e.message:"Failed to load matches")}}function x(){var e,t;c&&(c.innerHTML=`
    <div class="page-header">
      <div>
        <h3>DNA Matches</h3>
        <p>${l.length} match(es) found</p>
      </div>

      <button
        class="btn btn-primary"
        id="addMatchButton"
      >
        + Add Match
      </button>
    </div>

    ${l.length===0?`
          <div class="empty-state">
            <h3>No matches found</h3>
            <p>
              Your database doesn't contain any matches yet.
            </p>

            <button
              class="btn btn-primary"
              id="addFirstMatchButton"
            >
              + Add Match
            </button>
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

                ${l.map(a=>`
                      <tr>

                        <td>
                          ${a.id}
                        </td>

                        <td>
                          <strong>
                            ${s(a.fullname)}
                          </strong>
                        </td>

                        <td>
                          ${s(a.ydnahaplogroup)}
                        </td>

                        <td>
                          ${s(a.ydnasubclade)}
                        </td>

                        <td>
                          ${s(a.mtdna)}
                        </td>

                        <td>
                          ${s(a.pays)}
                        </td>

                        <td>
                          ${s(a.region)}
                        </td>

                        <td>
                          ${s(a.province)}
                        </td>

                        <td>
                          <div class="table-actions">

                            <button
                              class="btn btn-small btn-secondary edit-match-button"
                              data-id="${a.id}"
                            >
                              Edit
                            </button>

                            <button
                              class="btn btn-small btn-danger delete-match-button"
                              data-id="${a.id}"
                            >
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    `).join("")}

              </tbody>

            </table>
          </div>
        `}
  `,(e=document.getElementById("addMatchButton"))==null||e.addEventListener("click",()=>{v()}),(t=document.getElementById("addFirstMatchButton"))==null||t.addEventListener("click",()=>{v()}),document.querySelectorAll(".edit-match-button").forEach(a=>{a.addEventListener("click",async()=>{const o=Number(a.dataset.id);await T(o)})}),document.querySelectorAll(".delete-match-button").forEach(a=>{a.addEventListener("click",async()=>{const o=Number(a.dataset.id);await C(o)})}))}async function T(e){try{const t=await F(e);u=t.id,v(t)}catch(t){console.error(t),alert(t instanceof Error?t.message:"Failed to load match")}}function v(e){var o;const t=!!e;if(m(t?"Edit Match":"Add Match",t?`Update match #${e==null?void 0:e.id}`:"Add a new DNA match"),!c)return;c.innerHTML=`
    <div class="page-header">
      <div>
        <h3>
          ${t?"Edit DNA Match":"Add DNA Match"}
        </h3>

        <p>
          ${t?"Modify the information below.":"Enter the information of the new match."}
        </p>
      </div>
    </div>

    <form id="matchForm" class="match-form">

      <!-- PERSONAL INFORMATION -->

      <div class="form-section">

        <div class="form-section-title">
          Personal Information
        </div>

        <div class="form-grid">

          <div class="form-group">
            <label for="fullname">
              Full Name *
            </label>

            <input
              type="text"
              id="fullname"
              name="fullname"
              required
              value="${i((e==null?void 0:e.fullname)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="firstname">
              First Name
            </label>

            <input
              type="text"
              id="firstname"
              name="firstname"
              value="${i((e==null?void 0:e.firstname)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="middlename">
              Middle Name
            </label>

            <input
              type="text"
              id="middlename"
              name="middlename"
              value="${i((e==null?void 0:e.middlename)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="lastname">
              Last Name
            </label>

            <input
              type="text"
              id="lastname"
              name="lastname"
              value="${i((e==null?void 0:e.lastname)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="ancestralsurname">
              Ancestral Surname
            </label>

            <input
              type="text"
              id="ancestralsurname"
              name="ancestralsurname"
              value="${i((e==null?void 0:e.ancestralsurname)??"")}"
            />
          </div>

        </div>

      </div>

      <!-- DNA INFORMATION -->

      <div class="form-section">

        <div class="form-section-title">
          DNA Information
        </div>

        <div class="form-grid">

          <div class="form-group">
            <label for="ydnahaplogroup">
              Y-DNA Haplogroup
            </label>

            <input
              type="text"
              id="ydnahaplogroup"
              name="ydnahaplogroup"
              placeholder="Example: J-M267"
              value="${i((e==null?void 0:e.ydnahaplogroup)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="ydnasubclade">
              Y-DNA Subclade
            </label>

            <input
              type="text"
              id="ydnasubclade"
              name="ydnasubclade"
              placeholder="Example: J-Z1828"
              value="${i((e==null?void 0:e.ydnasubclade)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="mtdna">
              mtDNA
            </label>

            <input
              type="text"
              id="mtdna"
              name="mtdna"
              placeholder="Example: H1"
              value="${i((e==null?void 0:e.mtdna)??"")}"
            />
          </div>

        </div>

      </div>

      <!-- LOCATION -->

      <div class="form-section">

        <div class="form-section-title">
          Location & Ancestry
        </div>

        <div class="form-grid">

          <div class="form-group">
            <label for="pays">
              Country
            </label>

            <input
              type="text"
              id="pays"
              name="pays"
              value="${i((e==null?void 0:e.pays)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="region">
              Region
            </label>

            <input
              type="text"
              id="region"
              name="region"
              value="${i((e==null?void 0:e.region)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="province">
              Province
            </label>

            <input
              type="text"
              id="province"
              name="province"
              value="${i((e==null?void 0:e.province)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="commun">
              Commune
            </label>

            <input
              type="text"
              id="commun"
              name="commun"
              value="${i((e==null?void 0:e.commun)??"")}"
            />
          </div>

          <div class="form-group">
            <label for="tribe">
              Tribe
            </label>

            <input
              type="text"
              id="tribe"
              name="tribe"
              value="${i((e==null?void 0:e.tribe)??"")}"
            />
          </div>

        </div>

      </div>

      <!-- DETAILS -->

      <div class="form-section">

        <div class="form-section-title">
          Details
        </div>

        <div class="form-group">

          <label for="details">
            Additional Details
          </label>

          <textarea
            id="details"
            name="details"
            rows="5"
          >${s((e==null?void 0:e.details)??"")}</textarea>

        </div>

      </div>

      <!-- FORM ACTIONS -->

      <div class="form-actions">

        <button
          type="button"
          class="btn btn-secondary"
          id="cancelFormButton"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="btn btn-primary"
          id="submitFormButton"
        >
          ${t?"Update Match":"Create Match"}
        </button>

      </div>

    </form>
  `;const a=document.getElementById("matchForm");a==null||a.addEventListener("submit",async n=>{n.preventDefault(),await O(a)}),(o=document.getElementById("cancelFormButton"))==null||o.addEventListener("click",()=>{u=null,y("matches")})}async function O(e){const t=document.getElementById("submitFormButton");t&&(t.disabled=!0,t.textContent="Saving...");const a=new FormData(e),o={fullname:d(a,"fullname")??"",firstname:d(a,"firstname")??"",middlename:d(a,"middlename")??"",lastname:d(a,"lastname")??"",ancestralsurname:d(a,"ancestralsurname")??"",ydnahaplogroup:d(a,"ydnahaplogroup")??"",ydnasubclade:d(a,"ydnasubclade")??"",mtdna:d(a,"mtdna")??"",pays:d(a,"pays")??"",region:d(a,"region")??"",province:d(a,"province")??"",commun:d(a,"commun")??"",tribe:d(a,"tribe")??"",details:d(a,"details")??""};try{u!==null?(await B(u,o),alert("Match updated successfully!")):(await L(o),alert("Match created successfully!")),u=null,await h()}catch(n){console.error(n),alert(n instanceof Error?n.message:"Failed to save match"),t&&(t.disabled=!1,t.textContent=u!==null?"Update Match":"Create Match")}}function d(e,t){const a=e.get(t);if(typeof a!="string")return null;const o=a.trim();return o===""?null:o}async function C(e){const t=l.find(n=>n.id===e),a=(t==null?void 0:t.fullname)||`#${e}`;if(window.confirm(`Are you sure you want to delete "${a}"?`))try{await I(e),alert("Match deleted successfully!"),await h()}catch(n){console.error(n),alert(n instanceof Error?n.message:"Failed to delete match")}}function y(e){N=e,A.forEach(t=>{const a=t.dataset.page;t.classList.toggle("active",a===e)}),g(e)}async function g(e){if(e==="dashboard"){await E();return}if(e==="matches"){await h();return}await E()}A.forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.page;t&&y(t)})});async function S(){console.log("Initializing DNA Matches..."),await g("dashboard")}S().catch(e=>{console.error("Application initialization failed:",e),b("Unable to initialize the application.")});
