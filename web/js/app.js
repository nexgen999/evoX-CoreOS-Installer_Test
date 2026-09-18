const CONFIG = [
  "config/site.json","config/profile.json","config/socials.json","config/categories.json",
  "config/projects.json","config/theme.json","config/views.json","config/effects.json"
];

const state = { site:null, profile:null, socials:null, categories:[], projects:[], theme:null, views:null, effects:null,
  page:"home", category:null, view:"cards" };

async function loadConfig(){
  const [site,profile,socials,cats,projects,theme,views,effects] =
    await Promise.all(CONFIG.map(u=>fetch(u).then(r=>{if(!r.ok) throw new Error(u); return r.json();})));
  Object.assign(state,{site,profile,socials,categories:cats.categories||[],projects:projects.projects||[],theme,views,effects});
  state.view = state.site.default_view || state.views.home.default || "cards";
}

function iconHTML(icon, cls=""){
  if(!icon) return `<i class="fa-solid fa-cube ${cls}"></i>`;
  if(icon.type==="fa") return `<i class="${icon.value} ${cls}"></i>`;
  if(icon.type==="image" || icon.type==="url") return `<img src="${icon.value}" alt="" class="${cls}">`;
  if(icon.type==="emoji") return `<span class="${cls}">${icon.value}</span>`;
  return `<span class="${cls}">${icon.value||""}</span>`;
}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function linkAttrs(){return state.site.external.open_links_new_tab?' target="_blank" rel="noopener noreferrer"':'';}

function applyTheme(){
  const t=state.theme||{};
  const r=document.documentElement;
  const c=t.colors||{};
  Object.entries(c).forEach(([k,v])=>r.style.setProperty("--"+k.replace(/_/g,"-"),v));
  if(t.fonts){r.style.setProperty("--body-font",t.fonts.body||"Inter,sans-serif");r.style.setProperty("--display-font",t.fonts.display||"Inter,sans-serif");
    const g=t.fonts.google;
    if(g?.enabled){
      const href="https://fonts.googleapis.com/css2?family="+g.families.map(x=>x.replace(/ /g,"+")).join("&family=")+"&display=swap";
      const l=document.createElement("link");l.rel="stylesheet";l.href=href;document.head.appendChild(l);
    }
  }
  if(t.background?.grid || state.effects.background_grid) document.body.classList.add("grid-bg");
}

function renderProfile(){
  const p=state.profile;
  document.getElementById("avatar").src=p.avatar_url;
  document.getElementById("avatar").alt=`Avatar de ${p.display_name}`;
  document.getElementById("displayName").textContent=p.display_name;
  document.getElementById("bio").textContent=p.bio;
  document.getElementById("profileGithub").href=p.profile_link;
  document.getElementById("heroTags").innerHTML=(p.quick_tags||[]).map(x=>`<span>${esc(x)}</span>`).join("");
  const labels=[["repositories","Dépôts"],["organizations","Organisations"],["followers","Followers"],["following","Following"]];
  document.getElementById("stats").innerHTML=labels.map(([k,l])=>`<div class="stat"><b>${esc(p.stats?.[k]??"—")}</b><span>${l}</span></div>`).join("");
  document.getElementById("socials").innerHTML=(state.socials.items||[]).filter(x=>x.enabled&&x.url).map(x=>`
    <a class="social" href="${esc(x.url)}"${linkAttrs()} title="${esc(x.label)}">${iconHTML(x.icon)}</a>`).join("");
  document.getElementById("mainLogo").src=state.site.logo;
  document.getElementById("sideLogo").src=state.site.logo;
}

function projectCount(cat){return state.projects.filter(p=>p.categories?.includes(cat.id)).length}
function renderCategoryNav(){
  const all=`<div class="cat-nav ${!state.category?'active':''}" data-cat=""><span class="cat-icon"><i class="fa-solid fa-layer-group"></i></span><span>Tous</span><span class="count">${state.projects.length}</span></div>`;
  const rest=state.categories.sort((a,b)=>(a.order||99)-(b.order||99)).map(c=>`
    <div class="cat-nav ${state.category===c.id?'active':''}" data-cat="${esc(c.id)}">
      <span class="cat-icon" style="background:${c.accent||'rgba(255,255,255,.08)'}">${iconHTML(c.icon)}</span><span>${esc(c.name)}</span>
      ${state.site.show_category_counts?`<span class="count">${projectCount(c)}</span>`:""}
    </div>`).join("");
  document.getElementById("categoryNav").innerHTML=all+rest;
  document.querySelectorAll(".cat-nav").forEach(el=>el.onclick=()=>{state.category=el.dataset.cat||null;state.page="home";render();});
}

function projectCard(p){
  const img=p.images?.[0]||"https://placehold.co/900x500/07152a/169cff?text=Project";
  return `<article class="project-card" data-id="${esc(p.id)}">
    <div class="project-image-wrap"><img class="project-image" src="${esc(img)}" alt="${esc(p.name)}" loading="lazy"></div>
    <div class="project-body">
      <div class="project-name">${esc(p.name)} ${p.featured?'<i class="fa-solid fa-star" title="Projet mis en avant"></i>':""}</div>
      <div class="project-desc">${esc(p.description)}</div>
      ${p.tags?.length?`<div class="tags">${p.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>`:""}
      <div class="project-links">
        ${p.github?`<a class="project-link" href="${esc(p.github)}"${linkAttrs()}><i class="fa-brands fa-github"></i> Dépôt</a>`:""}
        ${p.website?`<a class="project-link" href="${esc(p.website)}"${linkAttrs()}><i class="fa-solid fa-arrow-up-right-from-square"></i> Site Web</a>`:""}
      </div>
    </div>
  </article>`;
}

function filteredProjects(){
  if(state.category) return state.projects.filter(p=>p.categories?.includes(state.category));
  return state.projects;
}

function renderGrid(list, mode=state.view){
  if(!list.length) return `<div class="empty">Aucun projet dans cette sélection.</div>`;
  if(mode==="list") return `<div class="project-list">${list.map(projectCard).join("")}</div>`;
  return `<div class="project-grid ${mode}">${list.map(projectCard).join("")}</div>`;
}

function categorySection(cat){
  const list=state.projects.filter(p=>p.categories?.includes(cat.id));
  if(!list.length) return "";
  return `<section class="category-section" data-category="${esc(cat.id)}">
    <div class="category-header">
      <span class="cat-icon" style="background:${cat.accent||'rgba(255,255,255,.08)'}">${iconHTML(cat.icon)}</span>
      <div class="category-title"><h3>${esc(cat.name)}</h3><p>${esc(cat.description||"")}</p></div>
      <span class="category-count">${list.length} projet${list.length>1?'s':''}</span>
      ${state.effects.category_scroll_buttons?`<div class="scroll-btns"><button class="scroll-btn prev"><i class="fa-solid fa-chevron-left"></i></button><button class="scroll-btn next"><i class="fa-solid fa-chevron-right"></i></button></div>`:""}
    </div>
    <div class="category-track">${list.map(projectCard).join("")}</div>
  </section>`;
}

function bindReveal(){
  const cards=document.querySelectorAll(".project-card");
  if(!state.effects.reveal_on_scroll){cards.forEach(c=>c.classList.add("revealed"));return;}
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("revealed");io.unobserve(e.target)}}),{threshold:.08});
  cards.forEach(c=>io.observe(c));
  document.querySelectorAll(".category-section").forEach(sec=>{
    const track=sec.querySelector(".category-track");
    const prev=sec.querySelector(".prev"),next=sec.querySelector(".next");
    if(prev) prev.onclick=()=>track.scrollBy({left:-Math.max(260,track.clientWidth*.75),behavior:"smooth"});
    if(next) next.onclick=()=>track.scrollBy({left:Math.max(260,track.clientWidth*.75),behavior:"smooth"});
  });
}

function render(){
  renderCategoryNav();
  const content=document.getElementById("content");
  const title=document.getElementById("pageTitle");
  const eyebrow=document.getElementById("pageEyebrow");

  if(state.page==="home"){
    title.textContent=state.category?(state.categories.find(c=>c.id===state.category)?.name||"Mes projets"):"Mes projets";
    eyebrow.textContent=state.category?"CATÉGORIE":"PORTFOLIO";
    if(state.category){
      content.innerHTML=renderGrid(filteredProjects(),state.view);
    }else{
      const cats=state.categories.filter(c=>c.show_on_home!==false).sort((a,b)=>(a.order||99)-(b.order||99));
      content.innerHTML=cats.map(categorySection).join("");
    }
  } else if(state.page==="projects"){
    title.textContent="Tous mes projets";eyebrow.textContent="PROJETS";
    content.innerHTML=renderGrid(state.projects,state.view);
  } else if(state.page==="categories"){
    title.textContent="Catégories";eyebrow.textContent="ORGANISATION";
    content.innerHTML=state.categories.map(c=>categorySection(c)).join("");
  } else if(state.page==="about"){
    title.textContent="À propos";eyebrow.textContent="PROFILE";
    content.innerHTML=`<section class="category-section"><h3>${esc(state.profile.display_name)}</h3><p class="project-desc" style="font-size:13px;min-height:0">${esc(state.profile.bio)}</p><div class="tags">${(state.profile.quick_tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div><a class="project-link" style="display:inline-block;width:auto" href="${esc(state.profile.profile_link)}"${linkAttrs()}><i class="fa-brands fa-github"></i> Voir mon GitHub</a></section>`;
  } else {
    title.textContent="Documentation";eyebrow.textContent="DOCS";
    content.innerHTML=`<section class="category-section"><h3>Documentation</h3><p class="project-desc" style="font-size:13px;min-height:0">Cette section est prête à accueillir vos liens vers README, wiki, guides ou documentation externe. Ajoutez-les dans un futur <code>config/links.json</code> si vous souhaitez l'étendre.</p></section>`;
  }
  bindReveal();
}

function bindUI(){
  document.querySelectorAll(".nav-item").forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
    state.page=btn.dataset.view;state.category=null;render();
    document.getElementById("sidebar").classList.remove("open");
  });
  document.querySelectorAll(".view-btn").forEach(btn=>btn.onclick=()=>{
    state.view=btn.dataset.viewMode;
    document.querySelectorAll(".view-btn").forEach(x=>x.classList.toggle("active",x===btn));
    render();
  });
  document.getElementById("mobileMenu").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
  if(state.effects.cursor_glow && !matchMedia("(prefers-reduced-motion: reduce)").matches){
    const g=document.getElementById("cursorGlow");
    addEventListener("pointermove",e=>{g.style.left=e.clientX+"px";g.style.top=e.clientY+"px";});
  } else document.getElementById("cursorGlow").style.display="none";
}

(async()=>{
  try{
    await loadConfig();applyTheme();renderProfile();bindUI();render();
    document.title=state.site.title;
    document.getElementById("footer").textContent=state.site.footer_text;
  }catch(err){
    document.body.innerHTML=`<div style="font-family:system-ui;color:white;background:#020814;min-height:100vh;padding:40px"><h1>Erreur de configuration</h1><p>Impossible de charger les fichiers JSON. Vérifiez les chemins et ouvrez le site via GitHub Pages ou un serveur local.</p><pre style="color:#7dc4ff">${esc(err.message)}</pre></div>`;
  }
})();