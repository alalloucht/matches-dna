(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))d(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&d(r)}).observe(document,{childList:!0,subtree:!0});function a(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function d(n){if(n.ep)return;n.ep=!0;const i=a(n);fetch(n.href,i)}})();let c=[];function m(){return c}function y(t){return c.find(e=>e.id===t)}function A(t){const e=new Date().toISOString(),a={id:Date.now(),...t,createdAt:e,updatedAt:e};return c.push(a),a}function D(t,e){const a=y(t);if(a)return Object.assign(a,e),a.updatedAt=new Date().toISOString(),a}function N(t){const e=c.findIndex(a=>a.id===t);return e===-1?!1:(c.splice(e,1),!0)}const $={dashboard:{title:"Dashboard",description:"Overview of your DNA matches"},matches:{title:"Matches",description:"Manage your DNA matches"}},f=document.getElementById("pageTitle"),g=document.getElementById("pageDescription"),s=document.getElementById("pageContent"),b=document.querySelectorAll(".nav-item");function S(){if(!s)return;const t=m();s.innerHTML=`

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
          ${t.length}
        </strong>

      </div>


      <div class="stat-card">

        <span class="stat-label">
          Y-DNA Haplogroups
        </span>

        <strong class="stat-value">

          ${new Set(t.map(e=>e.ydnahaplogroup).filter(Boolean)).size}

        </strong>

      </div>


      <div class="stat-card">

        <span class="stat-label">
          mtDNA
        </span>

        <strong class="stat-value">

          ${new Set(t.map(e=>e.mtdna).filter(Boolean)).size}

        </strong>

      </div>

    </div>

  `}function u(){var e;if(!s)return;const t=m();s.innerHTML=`

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

          ${t.length===0?`

                <tr>

                  <td
                    colspan="9"
                    class="empty-state"
                  >

                    No DNA matches yet.

                  </td>

                </tr>

              `:t.map(M).join("")}

        </tbody>

      </table>

    </div>

  `,(e=document.getElementById("addMatchButton"))==null||e.addEventListener("click",()=>{v()}),document.querySelectorAll(".edit-match").forEach(a=>{a.addEventListener("click",()=>{const d=Number(a.dataset.id);v(d)})}),document.querySelectorAll(".delete-match").forEach(a=>{a.addEventListener("click",()=>{const d=Number(a.dataset.id);E(d)})})}function M(t){return`

    <tr>

      <td>
        ${t.id}
      </td>

      <td>
        ${l(t.fullname)}
      </td>

      <td>
        ${l(t.ydnahaplogroup)}
      </td>

      <td>
        ${l(t.ydnasubclade)}
      </td>

      <td>
        ${l(t.mtdna)}
      </td>

      <td>
        ${l(t.pays)}
      </td>

      <td>
        ${l(t.region)}
      </td>

      <td>
        ${l(t.province)}
      </td>

      <td>

        <div class="actions">

          <button
            class="action-button edit-match"
            data-id="${t.id}"
          >
            Edit
          </button>


          <button
            class="action-button delete-match"
            data-id="${t.id}"
          >
            Delete
          </button>

        </div>

      </td>

    </tr>

  `}function v(t){var n;const e=t!==void 0?m().find(i=>i.id===t):void 0,a=!!e;if(!s)return;s.innerHTML=`

    <div class="page-header">

      <div>

        <h2>
          ${a?"Update Match":"Add Match"}
        </h2>

        <p>
          ${a?"Update DNA match information":"Add a new DNA match"}
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
              value="${o((e==null?void 0:e.fullname)??"")}"
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
              value="${o((e==null?void 0:e.firstname)??"")}"
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
              value="${o((e==null?void 0:e.middlename)??"")}"
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
              value="${o((e==null?void 0:e.lastname)??"")}"
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
              value="${o((e==null?void 0:e.ancestralsurname)??"")}"
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
              value="${o((e==null?void 0:e.ydnahaplogroup)??"")}"
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
              value="${o((e==null?void 0:e.ydnasubclade)??"")}"
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
              value="${o((e==null?void 0:e.mtdna)??"")}"
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
              value="${o((e==null?void 0:e.pays)??"")}"
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
              value="${o((e==null?void 0:e.region)??"")}"
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
              value="${o((e==null?void 0:e.province)??"")}"
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
              value="${o((e==null?void 0:e.commun)??"")}"
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
              value="${o((e==null?void 0:e.tribe)??"")}"
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
          >${l((e==null?void 0:e.details)??"")}</textarea>

        </div>


        <!-- =================
             ACTIONS
        ================== -->

        <div class="form-actions">

          <button
            type="submit"
            class="primary-button"
          >

            ${a?"Update Match":"Create Match"}

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

  `;const d=document.getElementById("matchForm");d==null||d.addEventListener("submit",i=>{i.preventDefault();const r=new FormData(d),p={fullname:String(r.get("fullname")??"").trim(),firstname:String(r.get("firstname")??"").trim(),middlename:String(r.get("middlename")??"").trim(),lastname:String(r.get("lastname")??"").trim(),ancestralsurname:String(r.get("ancestralsurname")??"").trim(),ydnahaplogroup:String(r.get("ydnahaplogroup")??"").trim(),ydnasubclade:String(r.get("ydnasubclade")??"").trim(),mtdna:String(r.get("mtdna")??"").trim(),pays:String(r.get("pays")??"").trim(),region:String(r.get("region")??"").trim(),province:String(r.get("province")??"").trim(),commun:String(r.get("commun")??"").trim(),tribe:String(r.get("tribe")??"").trim(),details:String(r.get("details")??"").trim()};a&&e?D(e.id,p):A(p),u()}),(n=document.getElementById("cancelButton"))==null||n.addEventListener("click",()=>{u()})}function E(t){const e=m().find(d=>d.id===t);!e||!confirm(`Delete match "${e.fullname}"?`)||(N(t),u())}function h(t){const e=$[t];if(e)switch(f&&(f.textContent=e.title),g&&(g.textContent=e.description),b.forEach(a=>{a.classList.toggle("active",a.dataset.page===t)}),t){case"dashboard":S();break;case"matches":u();break}}b.forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.page;e&&h(e)})});function l(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function o(t){return l(t)}h("dashboard");
