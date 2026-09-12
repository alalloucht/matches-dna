(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&c(o)}).observe(document,{childList:!0,subtree:!0});function r(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(t){if(t.ep)return;t.ep=!0;const s=r(t);fetch(t.href,s)}})();const u={dashboard:{title:"Dashboard",description:"Overview of your DNA matches"},matches:{title:"Matches",description:"Manage your DNA matches"}},i=document.getElementById("pageTitle"),d=document.getElementById("pageDescription"),n=document.getElementById("pageContent"),l=document.querySelectorAll(".nav-item");function p(){n&&(n.innerHTML=`

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
          0
        </strong>

      </div>


      <div class="stat-card">

        <span class="stat-label">
          Close Matches
        </span>

        <strong class="stat-value">
          0
        </strong>

      </div>


      <div class="stat-card">

        <span class="stat-label">
          Groups
        </span>

        <strong class="stat-value">
          0
        </strong>

      </div>

    </div>

  `)}function f(){if(!n)return;n.innerHTML=`

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

            <th>Name</th>

            <th>Shared DNA</th>

            <th>Relationship</th>

            <th>Actions</th>

          </tr>

        </thead>


        <tbody id="matchesTableBody">

          <tr>

            <td colspan="4" class="empty-state">

              No DNA matches yet.

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  `;const e=document.getElementById("addMatchButton");e==null||e.addEventListener("click",g)}function g(){console.log("Add Match"),alert("Add Match - coming soon")}function h(e){const a=u[e];if(a)switch(i&&(i.textContent=a.title),d&&(d.textContent=a.description),l.forEach(r=>{r.classList.toggle("active",r.dataset.page===e)}),e){case"dashboard":p();break;case"matches":f();break}}l.forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.page;a&&h(a)})});h("dashboard");
