(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const h="http://localhost:3000/matches";async function w(e=1,a=50,t={}){const n=new URLSearchParams;n.set("page",String(e)),n.set("limit",String(a)),t.search&&t.search.trim()&&n.set("search",t.search.trim()),t.pays&&t.pays.trim()&&n.set("pays",t.pays.trim()),t.region&&t.region.trim()&&n.set("region",t.region.trim()),t.province&&t.province.trim()&&n.set("province",t.province.trim()),t.ydnahaplogroup&&t.ydnahaplogroup.trim()&&n.set("ydnahaplogroup",t.ydnahaplogroup.trim()),t.ydnasubclade&&t.ydnasubclade.trim()&&n.set("ydnasubclade",t.ydnasubclade.trim()),t.mtdna&&t.mtdna.trim()&&n.set("mtdna",t.mtdna.trim()),t.tribe&&t.tribe.trim()&&n.set("tribe",t.tribe.trim());const r=await fetch(`${h}?${n.toString()}`);if(!r.ok){const i=await r.json().catch(()=>null);throw new Error((i==null?void 0:i.error)||"Failed to fetch matches")}return r.json()}async function I(e){const a=await fetch(`${h}/${e}`);if(!a.ok){if(a.status===404)throw new Error("Match not found");const t=await a.json().catch(()=>null);throw new Error((t==null?void 0:t.error)||"Failed to fetch match")}return a.json()}async function S(e){const a=await fetch(h,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!a.ok){const t=await a.json().catch(()=>null);throw new Error((t==null?void 0:t.error)||"Failed to create match")}return a.json()}async function D(e,a){const t=await fetch(`${h}/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!t.ok){const n=await t.json().catch(()=>null);throw t.status===404?new Error("Match not found"):new Error((n==null?void 0:n.error)||"Failed to update match")}return t.json()}async function P(e){const a=await fetch(`${h}/${e}`,{method:"DELETE"});if(!a.ok){const t=await a.json().catch(()=>null);throw a.status===404?new Error("Match not found"):new Error((t==null?void 0:t.error)||"Failed to delete match")}}let y=[],u=1;const F=50;let f={page:1,limit:F,total:0,totalPages:0,hasNextPage:!1,hasPreviousPage:!1},d={};const v=document.getElementById("pageTitle"),g=document.getElementById("pageDescription"),c=document.getElementById("pageContent");function p(e){return e===null?"":e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function o(e){return e===null?"":e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function $(){c&&(c.innerHTML=`
    <div class="loading">
      Loading...
    </div>
  `)}function N(e){c&&(c.innerHTML=`
    <div class="error-message">
      ${p(e)}
    </div>
  `)}async function A(){if(!(!v||!g||!c)){v.textContent="Dashboard",g.textContent="Overview of your DNA matches",$();try{const a=(await w(1,1)).pagination.total;c.innerHTML=`

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
            ${a.toLocaleString()}
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

    `}catch(e){console.error("Dashboard error:",e),N(e instanceof Error?e.message:"Failed to load dashboard")}}}async function b(e=u){if(!(!v||!g||!c)){v.textContent="Matches",g.textContent="Search, filter and manage your DNA matches",$();try{const a=await w(e,F,d);y=a.data,f=a.pagination,u=a.pagination.page,T()}catch(a){console.error("Matches error:",a),N(a instanceof Error?a.message:"Failed to load matches")}}}function T(){if(!c)return;const e=f.total,a=f.page,t=f.limit;let n=0,r=0;e>0&&(n=(a-1)*t+1,r=Math.min(a*t,e)),c.innerHTML=`

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


    <!-- ===================================================== -->
    <!-- SEARCH + FILTERS -->
    <!-- ===================================================== -->

    ${x()}


    <!-- ===================================================== -->
    <!-- TABLE -->
    <!-- ===================================================== -->

    ${y.length===0?`

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

                ${y.map(B).join("")}

              </tbody>

            </table>

          </div>

        `}


    <!-- ===================================================== -->
    <!-- PAGINATION -->
    <!-- ===================================================== -->

    ${R()}

  `,O()}function x(){return`

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
            value="${o(d.search??"")}"
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
            value="${o(d.pays??"")}"
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
            value="${o(d.region??"")}"
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
            value="${o(d.province??"")}"
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
            value="${o(d.ydnahaplogroup??"")}"
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
            value="${o(d.ydnasubclade??"")}"
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
            value="${o(d.mtdna??"")}"
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
            value="${o(d.tribe??"")}"
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

  `}function m(e){const a=document.getElementById(e);return a instanceof HTMLInputElement?a.value.trim():""}function E(){d={search:m("searchInput"),pays:m("paysFilter"),region:m("regionFilter"),province:m("provinceFilter"),ydnahaplogroup:m("ydnahaplogroupFilter"),ydnasubclade:m("ydnasubcladeFilter"),mtdna:m("mtdnaFilter"),tribe:m("tribeFilter")},Object.keys(d).forEach(e=>{const a=d[e];(!a||!a.trim())&&delete d[e]}),u=1,b(1)}function C(){d={},u=1,b(1)}function O(){const e=document.getElementById("addMatchButton");e==null||e.addEventListener("click",()=>{H()});const a=document.getElementById("searchButton");a==null||a.addEventListener("click",()=>{E()});const t=document.getElementById("applyFiltersButton");t==null||t.addEventListener("click",()=>{E()});const n=document.getElementById("clearFiltersButton");n==null||n.addEventListener("click",()=>{C()});const r=document.getElementById("searchInput");r==null||r.addEventListener("keydown",i=>{i instanceof KeyboardEvent&&i.key==="Enter"&&E()}),document.querySelectorAll(".edit-match-button").forEach(i=>{i.addEventListener("click",async()=>{const s=Number(i.dataset.id);Number.isInteger(s)&&await j(s)})}),document.querySelectorAll(".delete-match-button").forEach(i=>{i.addEventListener("click",async()=>{const s=Number(i.dataset.id);Number.isInteger(s)&&await k(s)})}),document.querySelectorAll(".pagination-button").forEach(i=>{i.addEventListener("click",async()=>{const s=Number(i.dataset.page);Number.isInteger(s)&&(s<1||s>f.totalPages||(u=s,await b(s)))})})}function B(e){return`

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

  `}function R(){const e=f.totalPages,a=f.page;if(e<=1)return"";const t=[];if(e<=7)for(let n=1;n<=e;n++)t.push(n);else t.push(1),a<=4?(t.push(2),t.push(3),t.push(4),t.push(5),t.push("ellipsis"),t.push(e)):a>=5&&a<=e-4?(t.push("ellipsis"),t.push(a-1),t.push(a),t.push(a+1),t.push("ellipsis"),t.push(e)):(t.push("ellipsis"),t.push(e-4),t.push(e-3),t.push(e-2),t.push(e-1),t.push(e));return`

    <div class="pagination-container">


      <div class="pagination-info">

        Page
        ${a.toLocaleString()}
        of
        ${e.toLocaleString()}

      </div>


      <div class="pagination">


        <!-- PREVIOUS -->

        <button
          class="pagination-button"
          data-page="${a-1}"

          ${f.hasPreviousPage?"":"disabled"}
        >
          Previous
        </button>


        <!-- PAGE NUMBERS -->

        ${t.map(n=>n==="ellipsis"?`

                  <span
                    class="pagination-ellipsis"
                  >
                    ...
                  </span>

                `:`

                <button
                  class="
                    pagination-button
                    ${n===a?"active":""}
                  "
                  data-page="${n}"
                >
                  ${n}
                </button>

              `).join("")}


        <!-- NEXT -->

        <button
          class="pagination-button"
          data-page="${a+1}"

          ${f.hasNextPage?"":"disabled"}
        >
          Next
        </button>


      </div>

    </div>

  `}function H(){!v||!g||!c||(v.textContent="Add Match",g.textContent="Create a new DNA match",c.innerHTML=L(),M(async e=>{try{await S(e),u=1,await b(1)}catch(a){alert(a instanceof Error?a.message:"Failed to create match")}}))}async function j(e){if(!(!v||!g||!c)){v.textContent="Edit Match",g.textContent="Update DNA match information",$();try{const a=await I(e);c.innerHTML=L(a),M(async t=>{try{await D(e,t),await b(u)}catch(n){alert(n instanceof Error?n.message:"Failed to update match")}})}catch(a){console.error("Edit match error:",a),N(a instanceof Error?a.message:"Failed to load match")}}}function L(e){const a=!!e;return`

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
      <!-- ACTIONS -->
      <!-- ================================================= -->

      <div class="form-actions">

        <button
          type="submit"
          class="primary-button"
        >

          ${a?"Update Match":"Create Match"}

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

  `}function l(e,a){const t=e.elements.namedItem(a);if(!(t instanceof HTMLInputElement)&&!(t instanceof HTMLTextAreaElement)&&!(t instanceof HTMLSelectElement))return null;const n=t.value.trim();return n===""?null:n}function M(e){const a=document.getElementById("matchForm");if(!(a instanceof HTMLFormElement))return;a.addEventListener("submit",async n=>{n.preventDefault();const r=l(a,"fullname");if(!r){alert("Full Name is required.");return}const i={fullname:r,firstname:l(a,"firstname"),middlename:l(a,"middlename"),lastname:l(a,"lastname"),ancestralsurname:l(a,"ancestralsurname"),ydnahaplogroup:l(a,"ydnahaplogroup"),ydnasubclade:l(a,"ydnasubclade"),mtdna:l(a,"mtdna"),pays:l(a,"pays"),region:l(a,"region"),province:l(a,"province"),commun:l(a,"commun"),tribe:l(a,"tribe"),details:l(a,"details")};await e(i)});const t=document.getElementById("cancelMatchButton");t==null||t.addEventListener("click",async()=>{await b(u)})}async function k(e){if(window.confirm(`Are you sure you want to delete match #${e}?`))try{await P(e),y.length===1&&u>1&&u--,await b(u)}catch(t){console.error("Delete match error:",t),alert(t instanceof Error?t.message:"Failed to delete match")}}function q(){const e=document.querySelectorAll(".nav-item");e.forEach(a=>{a.addEventListener("click",async()=>{const t=a.dataset.page;if(t){if(e.forEach(n=>{n.classList.remove("active")}),a.classList.add("active"),t==="dashboard"){await A();return}t==="matches"&&(u=1,await b(1))}})})}async function U(){console.log("DNA Matches started"),q(),await A()}U().catch(e=>{console.error("Application initialization failed:",e)});
