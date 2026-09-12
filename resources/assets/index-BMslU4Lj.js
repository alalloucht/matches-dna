(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=n(e);fetch(e.href,o)}})();console.log("DNA Matches started");const p={dashboard:{title:"Dashboard",description:"Overview of your DNA matches"},matches:{title:"Matches",description:"Manage and explore your DNA matches"},people:{title:"People",description:"Manage people related to your matches"},groups:{title:"Groups",description:"Organize your DNA matches into groups"},notes:{title:"Notes",description:"Manage your notes and observations"}},c=document.getElementById("pageTitle"),a=document.getElementById("pageDescription"),l=document.getElementById("pageContent"),d=document.querySelectorAll(".nav-item");function u(r){const t=p[r];t&&(c&&(c.textContent=t.title),a&&(a.textContent=t.description),d.forEach(n=>{n.classList.toggle("active",n.dataset.page===r)}),l&&(l.innerHTML=`
      <div class="welcome-card">

        <h2>${t.title}</h2>

        <p>
          ${t.description}
        </p>

      </div>
    `))}d.forEach(r=>{r.addEventListener("click",()=>{const t=r.dataset.page;t&&u(t)})});
