(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();const g="http://localhost:3000/matches";async function T(t=1,a=50,e={}){const n=new URLSearchParams;n.set("page",String(t)),n.set("limit",String(a)),e.search&&e.search.trim()&&n.set("search",e.search.trim()),e.pays&&e.pays.trim()&&n.set("pays",e.pays.trim()),e.region&&e.region.trim()&&n.set("region",e.region.trim()),e.province&&e.province.trim()&&n.set("province",e.province.trim()),e.ydnahaplogroup&&e.ydnahaplogroup.trim()&&n.set("ydnahaplogroup",e.ydnahaplogroup.trim()),e.ydnasubclade&&e.ydnasubclade.trim()&&n.set("ydnasubclade",e.ydnasubclade.trim()),e.mtdna&&e.mtdna.trim()&&n.set("mtdna",e.mtdna.trim()),e.tribe&&e.tribe.trim()&&n.set("tribe",e.tribe.trim());const r=await fetch(`${g}?${n.toString()}`);if(!r.ok){const i=await r.json().catch(()=>null);throw new Error((i==null?void 0:i.error)||"Failed to fetch matches")}return r.json()}async function S(){const t=await fetch(`${g}/stats`);if(!t.ok){const e=await t.json().catch(()=>null);throw new Error((e==null?void 0:e.error)||"Failed to fetch match statistics")}const a=await t.json();return{total:Number(a.total??0),today:Number(a.today??0),thisWeek:Number(a.thisWeek??0),thisMonth:Number(a.thisMonth??0)}}async function D(t=10){const a=Math.min(Math.max(Math.floor(t),1),100),e=await fetch(`${g}/recent?limit=${a}`);if(!e.ok){const r=await e.json().catch(()=>null);throw new Error((r==null?void 0:r.error)||"Failed to fetch recent matches")}const n=await e.json();return Array.isArray(n)?n:n&&Array.isArray(n.data)?n.data:[]}async function P(t){const a=await fetch(`${g}/${t}`);if(!a.ok){if(a.status===404)throw new Error("Match not found");const e=await a.json().catch(()=>null);throw new Error((e==null?void 0:e.error)||"Failed to fetch match")}return a.json()}async function x(t){const a=await fetch(g,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok){const e=await a.json().catch(()=>null);throw new Error((e==null?void 0:e.error)||"Failed to create match")}return a.json()}async function C(t,a){const e=await fetch(`${g}/${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!e.ok){const n=await e.json().catch(()=>null);throw e.status===404?new Error("Match not found"):new Error((n==null?void 0:n.error)||"Failed to update match")}return e.json()}async function O(t){const a=await fetch(`${g}/${t}`,{method:"DELETE"});if(!a.ok){const e=await a.json().catch(()=>null);throw a.status===404?new Error("Match not found"):new Error((e==null?void 0:e.error)||"Failed to delete match")}}let E=[],u=1;const w=50;let v={page:1,limit:w,total:0,totalPages:0,hasNextPage:!1,hasPreviousPage:!1},l={};const f=document.getElementById("pageTitle"),b=document.getElementById("pageDescription"),p=document.getElementById("pageContent");function c(t){return t===null?"":t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function o(t){return t===null?"":t.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function R(t){const a=new Date(t);return Number.isNaN(a.getTime())?t:a.toLocaleString(void 0,{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function y(t){return t.toLocaleString()}function $(){p&&(p.innerHTML=`
    <div class="loading">
      Loading...
    </div>
  `)}function N(t){p&&(p.innerHTML=`
    <div class="error-message">
      ${c(t)}
    </div>
  `)}async function M(){if(!(!f||!b||!p)){f.textContent="Dashboard",b.textContent="Overview of your DNA matches",$();try{const[t,a]=await Promise.all([S(),D(10)]);p.innerHTML=`

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
            ${y(t.total)}
          </div>

        </div>


        <!-- TODAY -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Added Today
          </div>

          <div class="dashboard-card-value">
            ${y(t.today)}
          </div>

        </div>


        <!-- THIS WEEK -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Added This Week
          </div>

          <div class="dashboard-card-value">
            ${y(t.thisWeek)}
          </div>

        </div>


        <!-- THIS MONTH -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Added This Month
          </div>

          <div class="dashboard-card-value">
            ${y(t.thisMonth)}
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


        ${a.length===0?`

              <div class="empty-state">

                No recent matches found.

              </div>

            `:`

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

                    ${a.map(B).join("")}

                  </tbody>

                </table>

              </div>

            `}


      </div>

    `;const e=document.getElementById("viewAllMatchesButton");e==null||e.addEventListener("click",async()=>{L("matches"),u=1,await h(1)})}catch(t){console.error("Dashboard error:",t),N(t instanceof Error?t.message:"Failed to load dashboard")}}}function B(t){return`

    <tr>

      <td>
        ${t.id}
      </td>


      <td>
        ${c(t.fullname)}
      </td>


      <td>
        ${c(t.ydnahaplogroup)}
      </td>


      <td>
        ${c(t.ydnasubclade)}
      </td>


      <td>
        ${c(t.mtdna)}
      </td>


      <td>
        ${c(t.pays)}
      </td>


      <td>
        ${R(t.createdAt??"")}
      </td>

    </tr>

  `}async function h(t=u){if(!(!f||!b||!p)){f.textContent="Matches",b.textContent="Search, filter and manage your DNA matches",$();try{const a=await T(t,w,l);E=a.data,v=a.pagination,u=a.pagination.page,H()}catch(a){console.error("Matches error:",a),N(a instanceof Error?a.message:"Failed to load matches")}}}function H(){if(!p)return;const t=v.total,a=v.page,e=v.limit;let n=0,r=0;t>0&&(n=(a-1)*e+1,r=Math.min(a*e,t)),p.innerHTML=`

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
          ${t.toLocaleString()}
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

    ${j()}


    <!-- ===================================================== -->
    <!-- TABLE -->
    <!-- ===================================================== -->

    ${E.length===0?`

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

                ${E.map(q).join("")}

              </tbody>

            </table>

          </div>

        `}


    <!-- ===================================================== -->
    <!-- PAGINATION -->
    <!-- ===================================================== -->

    ${U()}

  `,Y()}function j(){return`

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
            value="${o(l.search??"")}"
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
            value="${o(l.pays??"")}"
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
            value="${o(l.region??"")}"
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
            value="${o(l.province??"")}"
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
            value="${o(l.ydnahaplogroup??"")}"
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
            value="${o(l.ydnasubclade??"")}"
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
            value="${o(l.mtdna??"")}"
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
            value="${o(l.tribe??"")}"
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

  `}function m(t){const a=document.getElementById(t);return a instanceof HTMLInputElement?a.value.trim():""}function A(){l={search:m("searchInput"),pays:m("paysFilter"),region:m("regionFilter"),province:m("provinceFilter"),ydnahaplogroup:m("ydnahaplogroupFilter"),ydnasubclade:m("ydnasubcladeFilter"),mtdna:m("mtdnaFilter"),tribe:m("tribeFilter")},Object.keys(l).forEach(t=>{const a=l[t];(!a||!a.trim())&&delete l[t]}),u=1,h(1)}function k(){l={},u=1,h(1)}function Y(){const t=document.getElementById("addMatchButton");t==null||t.addEventListener("click",()=>{G()});const a=document.getElementById("searchButton");a==null||a.addEventListener("click",()=>{A()});const e=document.getElementById("applyFiltersButton");e==null||e.addEventListener("click",()=>{A()});const n=document.getElementById("clearFiltersButton");n==null||n.addEventListener("click",()=>{k()});const r=document.getElementById("searchInput");r==null||r.addEventListener("keydown",i=>{i instanceof KeyboardEvent&&i.key==="Enter"&&A()}),document.querySelectorAll(".edit-match-button").forEach(i=>{i.addEventListener("click",async()=>{const s=Number(i.dataset.id);Number.isInteger(s)&&await V(s)})}),document.querySelectorAll(".delete-match-button").forEach(i=>{i.addEventListener("click",async()=>{const s=Number(i.dataset.id);Number.isInteger(s)&&await W(s)})}),document.querySelectorAll(".pagination-button").forEach(i=>{i.addEventListener("click",async()=>{const s=Number(i.dataset.page);Number.isInteger(s)&&(s<1||s>v.totalPages||(u=s,await h(s)))})})}function q(t){return`

    <tr>

      <td>
        ${t.id}
      </td>


      <td>
        ${c(t.fullname)}
      </td>


      <td>
        ${c(t.ydnahaplogroup)}
      </td>


      <td>
        ${c(t.ydnasubclade)}
      </td>


      <td>
        ${c(t.mtdna)}
      </td>


      <td>
        ${c(t.pays)}
      </td>


      <td>
        ${c(t.region)}
      </td>


      <td>
        ${c(t.province)}
      </td>


      <td>

        <div class="action-buttons">

          <button
            class="action-button edit-match-button"
            data-id="${t.id}"
          >
            Edit
          </button>


          <button
            class="action-button delete-match-button"
            data-id="${t.id}"
          >
            Delete
          </button>

        </div>

      </td>

    </tr>

  `}function U(){const t=v.totalPages,a=v.page;if(t<=1)return"";const e=[];if(t<=7)for(let n=1;n<=t;n++)e.push(n);else e.push(1),a<=4?(e.push(2),e.push(3),e.push(4),e.push(5),e.push("ellipsis"),e.push(t)):a>=5&&a<=t-4?(e.push("ellipsis"),e.push(a-1),e.push(a),e.push(a+1),e.push("ellipsis"),e.push(t)):(e.push("ellipsis"),e.push(t-4),e.push(t-3),e.push(t-2),e.push(t-1),e.push(t));return`

    <div class="pagination-container">


      <div class="pagination-info">

        Page
        ${a.toLocaleString()}
        of
        ${t.toLocaleString()}

      </div>


      <div class="pagination">


        <!-- PREVIOUS -->

        <button
          class="pagination-button"
          data-page="${a-1}"

          ${v.hasPreviousPage?"":"disabled"}
        >
          Previous
        </button>


        <!-- PAGE NUMBERS -->

        ${e.map(n=>n==="ellipsis"?`

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

          ${v.hasNextPage?"":"disabled"}
        >
          Next
        </button>


      </div>

    </div>

  `}function G(){!f||!b||!p||(f.textContent="Add Match",b.textContent="Create a new DNA match",p.innerHTML=F(),I(async t=>{try{await x(t),u=1,await h(1)}catch(a){alert(a instanceof Error?a.message:"Failed to create match")}}))}async function V(t){if(!(!f||!b||!p)){f.textContent="Edit Match",b.textContent="Update DNA match information",$();try{const a=await P(t);p.innerHTML=F(a),I(async e=>{try{await C(t,e),await h(u)}catch(n){alert(n instanceof Error?n.message:"Failed to update match")}})}catch(a){console.error("Edit match error:",a),N(a instanceof Error?a.message:"Failed to load match")}}}function F(t){const a=!!t;return`

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
              value="${o((t==null?void 0:t.fullname)??"")}"
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
              value="${o((t==null?void 0:t.firstname)??"")}"
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
              value="${o((t==null?void 0:t.middlename)??"")}"
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
              value="${o((t==null?void 0:t.lastname)??"")}"
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
              value="${o((t==null?void 0:t.ancestralsurname)??"")}"
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
              value="${o((t==null?void 0:t.ydnahaplogroup)??"")}"
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
              value="${o((t==null?void 0:t.ydnasubclade)??"")}"
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
              value="${o((t==null?void 0:t.mtdna)??"")}"
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
              value="${o((t==null?void 0:t.pays)??"")}"
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
              value="${o((t==null?void 0:t.region)??"")}"
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
              value="${o((t==null?void 0:t.province)??"")}"
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
              value="${o((t==null?void 0:t.commun)??"")}"
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
              value="${o((t==null?void 0:t.tribe)??"")}"
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
          >${c((t==null?void 0:t.details)??"")}</textarea>

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

  `}function d(t,a){const e=t.elements.namedItem(a);if(!(e instanceof HTMLInputElement)&&!(e instanceof HTMLTextAreaElement)&&!(e instanceof HTMLSelectElement))return null;const n=e.value.trim();return n===""?null:n}function I(t){const a=document.getElementById("matchForm");if(!(a instanceof HTMLFormElement))return;a.addEventListener("submit",async n=>{n.preventDefault();const r=d(a,"fullname");if(!r){alert("Full Name is required.");return}const i={fullname:r,firstname:d(a,"firstname"),middlename:d(a,"middlename"),lastname:d(a,"lastname"),ancestralsurname:d(a,"ancestralsurname"),ydnahaplogroup:d(a,"ydnahaplogroup"),ydnasubclade:d(a,"ydnasubclade"),mtdna:d(a,"mtdna"),pays:d(a,"pays"),region:d(a,"region"),province:d(a,"province"),commun:d(a,"commun"),tribe:d(a,"tribe"),details:d(a,"details")};await t(i)});const e=document.getElementById("cancelMatchButton");e==null||e.addEventListener("click",async()=>{await h(u)})}async function W(t){if(window.confirm(`Are you sure you want to delete match #${t}?`))try{await O(t),E.length===1&&u>1&&u--,await h(u)}catch(e){console.error("Delete match error:",e),alert(e instanceof Error?e.message:"Failed to delete match")}}function L(t){document.querySelectorAll(".nav-item").forEach(e=>{e.classList.toggle("active",e.dataset.page===t)})}function J(){document.querySelectorAll(".nav-item").forEach(a=>{a.addEventListener("click",async()=>{const e=a.dataset.page;if(e){if(L(e),e==="dashboard"){await M();return}e==="matches"&&(u=1,await h(1))}})})}async function K(){console.log("DNA Matches started"),J(),await M()}K().catch(t=>{console.error("Application initialization failed:",t)});
