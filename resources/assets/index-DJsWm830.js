(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const y="http://localhost:3000/matches";async function B(e=1,a=50,t={}){const n=new URLSearchParams;n.set("page",String(e)),n.set("limit",String(a)),t.search&&t.search.trim()&&n.set("search",t.search.trim()),t.pays&&t.pays.trim()&&n.set("pays",t.pays.trim()),t.region&&t.region.trim()&&n.set("region",t.region.trim()),t.province&&t.province.trim()&&n.set("province",t.province.trim()),t.ydnahaplogroup&&t.ydnahaplogroup.trim()&&n.set("ydnahaplogroup",t.ydnahaplogroup.trim()),t.ydnasubclade&&t.ydnasubclade.trim()&&n.set("ydnasubclade",t.ydnasubclade.trim()),t.mtdna&&t.mtdna.trim()&&n.set("mtdna",t.mtdna.trim()),t.tribe&&t.tribe.trim()&&n.set("tribe",t.tribe.trim());const i=await fetch(`${y}?${n.toString()}`);if(!i.ok){const r=await i.json().catch(()=>null);throw new Error((r==null?void 0:r.error)||"Failed to fetch matches")}return i.json()}async function j(){const e=await fetch(`${y}/stats`);if(!e.ok){const t=await e.json().catch(()=>null);throw new Error((t==null?void 0:t.error)||"Failed to fetch match statistics")}const a=await e.json();return{total:Number(a.total??0),today:Number(a.today??0),thisWeek:Number(a.thisWeek??0),thisMonth:Number(a.thisMonth??0)}}async function Y(e=10){const a=Math.min(Math.max(Math.floor(e),1),100),t=await fetch(`${y}/recent?limit=${a}`);if(!t.ok){const i=await t.json().catch(()=>null);throw new Error((i==null?void 0:i.error)||"Failed to fetch recent matches")}const n=await t.json();return Array.isArray(n)?n:n&&Array.isArray(n.data)?n.data:[]}async function M(e){const a=await fetch(`${y}/${e}`);if(!a.ok){if(a.status===404)throw new Error("Match not found");const t=await a.json().catch(()=>null);throw new Error((t==null?void 0:t.error)||"Failed to fetch match")}return a.json()}async function q(e){const a=await fetch(y,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!a.ok){const t=await a.json().catch(()=>null);throw new Error((t==null?void 0:t.error)||"Failed to create match")}return a.json()}async function U(e,a){const t=await fetch(`${y}/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!t.ok){const n=await t.json().catch(()=>null);throw t.status===404?new Error("Match not found"):new Error((n==null?void 0:n.error)||"Failed to update match")}return t.json()}async function W(e){const a=await fetch(`${y}/${e}`,{method:"DELETE"});if(!a.ok){const t=await a.json().catch(()=>null);throw a.status===404?new Error("Match not found"):new Error((t==null?void 0:t.error)||"Failed to delete match")}}let A=[],u=1;const F=50;let f={page:1,limit:F,total:0,totalPages:0,hasNextPage:!1,hasPreviousPage:!1},c={};const h=document.getElementById("pageTitle"),b=document.getElementById("pageDescription"),p=document.getElementById("pageContent");function s(e){return e===null?"":e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function l(e){return e===null?"":e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function $(e){const a=new Date(e);return Number.isNaN(a.getTime())?e:a.toLocaleString(void 0,{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function E(e){return e.toLocaleString()}function T(){p&&(p.innerHTML=`
    <div class="loading">
      Loading...
    </div>
  `)}function S(e){p&&(p.innerHTML=`
    <div class="error-message">
      ${s(e)}
    </div>
  `)}async function D(){if(!(!h||!b||!p)){h.textContent="Dashboard",b.textContent="Overview of your DNA matches",T();try{const[e,a]=await Promise.all([j(),Y(10)]);p.innerHTML=`

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
            ${E(e.total)}
          </div>

        </div>


        <!-- TODAY -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Added Today
          </div>

          <div class="dashboard-card-value">
            ${E(e.today)}
          </div>

        </div>


        <!-- THIS WEEK -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Added This Week
          </div>

          <div class="dashboard-card-value">
            ${E(e.thisWeek)}
          </div>

        </div>


        <!-- THIS MONTH -->

        <div class="dashboard-card">

          <div class="dashboard-card-title">
            Added This Month
          </div>

          <div class="dashboard-card-value">
            ${E(e.thisMonth)}
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

                    ${a.map(G).join("")}

                  </tbody>

                </table>

              </div>

            `}


      </div>

    `;const t=document.getElementById("viewAllMatchesButton");t==null||t.addEventListener("click",async()=>{P("matches"),u=1,await m(1)})}catch(e){console.error("Dashboard error:",e),S(e instanceof Error?e.message:"Failed to load dashboard")}}}function G(e){return`

    <tr>

      <td>
        ${e.id}
      </td>


      <td>
        ${s(e.fullname)}
      </td>


      <td>
        ${s(e.ydnahaplogroup)}
      </td>


      <td>
        ${s(e.ydnasubclade)}
      </td>


      <td>
        ${s(e.mtdna)}
      </td>


      <td>
        ${s(e.pays)}
      </td>


      <td>
        ${$(e.createdAt??"")}
      </td>

    </tr>

  `}async function m(e=u){if(!(!h||!b||!p)){h.textContent="Matches",b.textContent="Search, filter and manage your DNA matches",T();try{const a=await B(e,F,c);A=a.data,f=a.pagination,u=a.pagination.page,x()}catch(a){console.error("Matches error:",a),S(a instanceof Error?a.message:"Failed to load matches")}}}function x(){if(!p)return;const e=f.total,a=f.page,t=f.limit;let n=0,i=0;e>0&&(n=(a-1)*t+1,i=Math.min(a*t,e)),p.innerHTML=`

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
          ${i.toLocaleString()}
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

    ${V()}


    <!-- ===================================================== -->
    <!-- TABLE -->
    <!-- ===================================================== -->

    ${A.length===0?`

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

                ${A.map(z).join("")}

              </tbody>

            </table>

          </div>

        `}


    <!-- ===================================================== -->
    <!-- PAGINATION -->
    <!-- ===================================================== -->

    ${ee()}

  `,K()}function V(){return`

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
            value="${l(c.search??"")}"
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
            value="${l(c.pays??"")}"
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
            value="${l(c.region??"")}"
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
            value="${l(c.province??"")}"
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
            value="${l(c.ydnahaplogroup??"")}"
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
            value="${l(c.ydnasubclade??"")}"
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
            value="${l(c.mtdna??"")}"
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
            value="${l(c.tribe??"")}"
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

  `}function v(e){const a=document.getElementById(e);return a instanceof HTMLInputElement?a.value.trim():""}function w(){c={search:v("searchInput"),pays:v("paysFilter"),region:v("regionFilter"),province:v("provinceFilter"),ydnahaplogroup:v("ydnahaplogroupFilter"),ydnasubclade:v("ydnasubcladeFilter"),mtdna:v("mtdnaFilter"),tribe:v("tribeFilter")},Object.keys(c).forEach(e=>{const a=c[e];(!a||!a.trim())&&delete c[e]}),u=1,m(1)}function J(){c={},u=1,m(1)}function K(){const e=document.getElementById("addMatchButton");e==null||e.addEventListener("click",()=>{te()});const a=document.getElementById("searchButton");a==null||a.addEventListener("click",()=>{w()});const t=document.getElementById("applyFiltersButton");t==null||t.addEventListener("click",()=>{w()});const n=document.getElementById("clearFiltersButton");n==null||n.addEventListener("click",()=>{J()});const i=document.getElementById("searchInput");i==null||i.addEventListener("keydown",r=>{r instanceof KeyboardEvent&&r.key==="Enter"&&w()}),document.querySelectorAll(".edit-match-button").forEach(r=>{r.addEventListener("click",async()=>{const o=Number(r.dataset.id);Number.isInteger(o)&&await ae(o)})}),document.querySelectorAll(".view-match-button").forEach(r=>{r.addEventListener("click",async()=>{const o=Number(r.dataset.id);Number.isInteger(o)&&await Q(o)})}),document.querySelectorAll(".export-match-button").forEach(r=>{r.addEventListener("click",async()=>{const o=Number(r.dataset.id);Number.isInteger(o)&&await Z(o)})}),document.querySelectorAll(".delete-match-button").forEach(r=>{r.addEventListener("click",async()=>{const o=Number(r.dataset.id);Number.isInteger(o)&&await ne(o)})}),document.querySelectorAll(".pagination-button").forEach(r=>{r.addEventListener("click",async()=>{const o=Number(r.dataset.page);Number.isInteger(o)&&(o<1||o>f.totalPages||(u=o,await m(o)))})})}function z(e){return`

    <tr>

      <td>
        ${e.id}
      </td>


      <td>
        ${s(e.fullname)}
      </td>


      <td>
        ${s(e.ydnahaplogroup)}
      </td>


      <td>
        ${s(e.ydnasubclade)}
      </td>


      <td>
        ${s(e.mtdna)}
      </td>


      <td>
        ${s(e.pays)}
      </td>


      <td>
        ${s(e.region)}
      </td>


      <td>
        ${s(e.province)}
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
            class="action-button view-match-button"
            data-id="${e.id}"
          >
            Consulter
          </button>


          <button
            class="action-button export-match-button"
            data-id="${e.id}"
          >
            Export
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

  `}async function Q(e){var a;try{const t=await M(e),n=document.createElement("div");n.className="match-modal-backdrop",n.innerHTML=X(t),document.body.appendChild(n);const i=()=>{n.remove()};(a=n.querySelector(".match-modal-close"))==null||a.addEventListener("click",i),n.addEventListener("click",r=>{r.target===n&&i()}),document.addEventListener("keydown",function r(o){o.key==="Escape"&&(i(),document.removeEventListener("keydown",r))})}catch(t){alert(t instanceof Error?t.message:"Failed to load match details")}}function X(e){const a=[["Match ID",String(e.id)],["Full Name",e.fullname],["First Name",e.firstname],["Middle Name",e.middlename],["Last Name",e.lastname],["Ancestral Surname",e.ancestralsurname],["Y-DNA Haplogroup",e.ydnahaplogroup],["Y-DNA Subclade",e.ydnasubclade],["mtDNA",e.mtdna],["Country",e.pays],["Region",e.region],["Province",e.province],["Commune",e.commun],["Tribe",e.tribe],["Created",e.createdAt?$(e.createdAt):null],["Updated",e.updatedAt?$(e.updatedAt):null]];return`

    <div class="match-modal" role="dialog" aria-modal="true" aria-labelledby="matchModalTitle">

      <div class="match-modal-header">
        <div>
          <span class="match-modal-kicker">DNA MATCH</span>
          <h2 id="matchModalTitle">${s(e.fullname)}</h2>
        </div>

        <button class="match-modal-close" type="button" aria-label="Close details">&times;</button>
      </div>

      <div class="match-detail-grid">
        ${a.map(([t,n])=>`
              <div class="match-detail-item">
                <span>${t}</span>
                <strong>${s(n??"Not provided")}</strong>
              </div>
            `).join("")}
      </div>

      <div class="match-detail-notes">
        <span>Details</span>
        <p>${s(e.details??"Not provided")}</p>
      </div>

    </div>

  `}async function Z(e){try{const a=await M(e),t=document.createElement("canvas");t.width=1600,t.height=1e3;const n=t.getContext("2d");if(!n)throw new Error("Image export is not supported");_(n,a);const i=document.createElement("a");i.download=`dna-match-${a.id}-${a.fullname.replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").toLowerCase()}.png`,i.href=t.toDataURL("image/png"),i.click()}catch(a){alert(a instanceof Error?a.message:"Failed to export match image")}}function _(e,a){const t="#172335",n="#718096",i="#0d8f8a",r="#e4f5f3",o="#d2dde8";e.fillStyle="#f6f9fc",e.fillRect(0,0,1600,1e3),e.fillStyle="#ffffff",e.fillRect(70,60,1460,880),e.fillStyle=i,e.fillRect(70,60,1460,12),e.font="700 26px Arial",e.fillStyle=t,e.fillText("DNA MATCHES",120,135),e.font="16px Arial",e.fillStyle=n,e.fillText("Family Tree DNA Profile",120,165),e.font="700 42px Arial",e.fillStyle=t,e.fillText(a.fullname,120,260),e.font="18px Arial",e.fillStyle=n,e.fillText(`Match #${a.id}`,120,295),e.strokeStyle=o,e.lineWidth=4,e.beginPath(),e.moveTo(800,320),e.lineTo(800,390),e.moveTo(460,390),e.lineTo(1140,390),e.moveTo(460,390),e.lineTo(460,430),e.moveTo(800,390),e.lineTo(800,430),e.moveTo(1140,390),e.lineTo(1140,430),e.stroke();const N=(g,k,O)=>{e.fillStyle=r,e.fillRect(g,430,300,230),e.strokeStyle=o,e.lineWidth=2,e.strokeRect(g,430,300,230),e.fillStyle=i,e.fillRect(g,430,300,8),e.font="700 20px Arial",e.fillStyle=t,e.fillText(k,g+24,480),e.font="17px Arial",O.forEach((H,L)=>{e.fillStyle=L===0?t:n,e.fillText(H,g+24,525+L*34)})};N(310,"Y-DNA LINE",[a.ydnahaplogroup||"Haplogroup not provided",a.ydnasubclade||"Subclade not provided"]),N(650,"mtDNA LINE",[a.mtdna||"mtDNA not provided","Maternal DNA profile"]),N(990,"ORIGIN",[[a.pays,a.region].filter(Boolean).join(", ")||"Location not provided",[a.province,a.commun].filter(Boolean).join(", ")||"Locality not provided"]),e.font="700 18px Arial",e.fillStyle=n,e.fillText("Family details",120,755),e.font="18px Arial",e.fillStyle=t;const R=a.details||"No additional details provided";e.fillText(R.slice(0,115),120,795),e.font="14px Arial",e.fillStyle=n,e.fillText("Exported from DNA MATCHES",120,885)}function ee(){const e=f.totalPages,a=f.page;if(e<=1)return"";const t=[];if(e<=7)for(let n=1;n<=e;n++)t.push(n);else t.push(1),a<=4?(t.push(2),t.push(3),t.push(4),t.push(5),t.push("ellipsis"),t.push(e)):a>=5&&a<=e-4?(t.push("ellipsis"),t.push(a-1),t.push(a),t.push(a+1),t.push("ellipsis"),t.push(e)):(t.push("ellipsis"),t.push(e-4),t.push(e-3),t.push(e-2),t.push(e-1),t.push(e));return`

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

  `}function te(){!h||!b||!p||(h.textContent="Add Match",b.textContent="Create a new DNA match",p.innerHTML=I(),C(async e=>{try{await q(e),u=1,await m(1)}catch(a){alert(a instanceof Error?a.message:"Failed to create match")}}))}async function ae(e){if(!(!h||!b||!p)){h.textContent="Edit Match",b.textContent="Update DNA match information",T();try{const a=await M(e);p.innerHTML=I(a),C(async t=>{try{await U(e,t),await m(u)}catch(n){alert(n instanceof Error?n.message:"Failed to update match")}})}catch(a){console.error("Edit match error:",a),S(a instanceof Error?a.message:"Failed to load match")}}}function I(e){const a=!!e;return`

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
              value="${l((e==null?void 0:e.fullname)??"")}"
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
              value="${l((e==null?void 0:e.firstname)??"")}"
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
              value="${l((e==null?void 0:e.middlename)??"")}"
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
              value="${l((e==null?void 0:e.lastname)??"")}"
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
              value="${l((e==null?void 0:e.ancestralsurname)??"")}"
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
              value="${l((e==null?void 0:e.ydnahaplogroup)??"")}"
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
              value="${l((e==null?void 0:e.ydnasubclade)??"")}"
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
              value="${l((e==null?void 0:e.mtdna)??"")}"
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
              value="${l((e==null?void 0:e.pays)??"")}"
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
              value="${l((e==null?void 0:e.region)??"")}"
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
              value="${l((e==null?void 0:e.province)??"")}"
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
              value="${l((e==null?void 0:e.commun)??"")}"
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
              value="${l((e==null?void 0:e.tribe)??"")}"
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
          >${s((e==null?void 0:e.details)??"")}</textarea>

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

  `}function d(e,a){const t=e.elements.namedItem(a);if(!(t instanceof HTMLInputElement)&&!(t instanceof HTMLTextAreaElement)&&!(t instanceof HTMLSelectElement))return null;const n=t.value.trim();return n===""?null:n}function C(e){const a=document.getElementById("matchForm");if(!(a instanceof HTMLFormElement))return;a.addEventListener("submit",async n=>{n.preventDefault();const i=d(a,"fullname");if(!i){alert("Full Name is required.");return}const r={fullname:i,firstname:d(a,"firstname"),middlename:d(a,"middlename"),lastname:d(a,"lastname"),ancestralsurname:d(a,"ancestralsurname"),ydnahaplogroup:d(a,"ydnahaplogroup"),ydnasubclade:d(a,"ydnasubclade"),mtdna:d(a,"mtdna"),pays:d(a,"pays"),region:d(a,"region"),province:d(a,"province"),commun:d(a,"commun"),tribe:d(a,"tribe"),details:d(a,"details")};await e(r)});const t=document.getElementById("cancelMatchButton");t==null||t.addEventListener("click",async()=>{await m(u)})}async function ne(e){if(window.confirm(`Are you sure you want to delete match #${e}?`))try{await W(e),A.length===1&&u>1&&u--,await m(u)}catch(t){console.error("Delete match error:",t),alert(t instanceof Error?t.message:"Failed to delete match")}}function P(e){document.querySelectorAll(".nav-item").forEach(t=>{t.classList.toggle("active",t.dataset.page===e)})}function ie(){document.querySelectorAll(".nav-item").forEach(a=>{a.addEventListener("click",async()=>{const t=a.dataset.page;if(t){if(P(t),t==="dashboard"){await D();return}t==="matches"&&(u=1,await m(1))}})})}async function re(){console.log("DNA Matches started"),ie(),await D()}re().catch(e=>{console.error("Application initialization failed:",e)});
