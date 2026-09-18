const FILES=["config/site.json","config/profile.json","config/socials.json","config/categories.json","config/projects.json","config/github-import.json","config/theme.json","config/views.json","config/effects.json","config/navigation.json","config/docs.json"];
const state={site:null,profile:null,socials:null,categories:[],projects:[],githubImport:null,theme:null,views:null,effects:null,navigation:null,docs:null,page:"home",category:null,tag:null,query:"",view:"cards",favorites:JSON.parse(localStorage.getItem("nexgenFavorites")||"[]"),galleryIndex:0,galleryProject:null,imported:[]};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const attrs=()=>state.site.external.open_links_new_tab?' target="_blank" rel="noopener noreferrer"':'';

async function load(){
  const vals=await Promise.all(FILES.map(u=>fetch(u).then(r=>{if(!r.ok)throw Error(u);return r.json()})));
  [state.site,state.profile,state.socials,state.categories,state.projects,state.githubImport,state.theme,state.views,state.effects,state.navigation,state.docs]=[
    vals[0],vals[1],vals[2],vals[3].categories||[],vals[4].projects||[],vals[5],vals[6],vals[7],vals[8],vals[9],vals[10]
  ];
  state.view=state.site.default_view||state.views.home.default||"cards";
}
function iconHTML(icon){if(!icon)return '<i class="fa-solid fa-cube"></i>';if(icon.type==="fa")return `<i class="${esc(icon.value)}"></i>`;if(icon.type==="image"||icon.type==="url")return `<img src="${esc(icon.value)}" alt="">`;return `<span>${esc(icon.value||"")}</span>`}
function projectCount(c){return state.projects.filter(p=>p.categories?.includes(c.id)).length}
function applyTheme(name=state.theme.active){
  const t=state.theme.themes[name]||state.theme.themes[state.theme.active];
  state.theme.active=name;
  const r=document.documentElement;
  Object.entries(t.colors||{}).forEach(([k,v])=>r.style.setProperty("--"+k.replace(/_/g,"-"),v));
  const f=state.theme.fonts||{};
  r.style.setProperty("--body-font",f.body||"Inter,sans-serif");r.style.setProperty("--display-font",f.display||"Inter,sans-serif");
  if(f.google?.enabled&&!$("#googleFonts")){const l=document.createElement("link");l.id="googleFonts";l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family="+f.google.families.map(x=>x.replace(/ /g,"+")).join("&family=")+"&display=swap";document.head.appendChild(l)}
  if(state.theme.background?.grid||state.effects.background_grid)document.body.classList.add("grid-bg");
  localStorage.setItem("nexgenTheme",name);
}
function renderProfile(){
  const p=state.profile;$("#avatar").src=p.avatar_url;$("#displayName").textContent=p.display_name;$("#bio").textContent=p.bio;$("#profileGithub").href=p.profile_link;
  $("#heroTags").innerHTML=(p.quick_tags||[]).map(x=>`<span>${esc(x)}</span>`).join("");
  $("#stats").innerHTML=[["repositories","Dépôts"],["organizations","Organisations"],["followers","Followers"],["following","Following"]].map(([k,l])=>`<div class="stat"><b>${esc(p.stats?.[k]??"—")}</b><span>${l}</span></div>`).join("");
  $("#socials").innerHTML=(state.socials.items||[]).filter(x=>x.enabled&&x.url).map(x=>`<a class="social" href="${esc(x.url)}"${attrs()} title="${esc(x.label)}">${iconHTML(x.icon)}</a>`).join("");
  $("#mainLogo").src=state.site.logo;$("#sideLogo").src=state.site.logo;
}
function renderNav(){
  $("#mainNav").innerHTML=(state.navigation.items||[]).map(n=>`<button class="nav-item ${state.page===n.id?'active':''}" data-page="${esc(n.id)}">${iconHTML(n.icon)}<span>${esc(n.label)}</span></button>`).join("");
  $$(".nav-item").forEach(b=>b.onclick=()=>{state.page=b.dataset.page;state.category=null;state.tag=null;history.replaceState(null,"","#"+state.page);render()});
  $("#categoryNav").innerHTML=`<div class="cat-nav ${!state.category?'active':''}" data-cat=""><span class="cat-icon"><i class="fa-solid fa-layer-group"></i></span><span>Tous</span><span class="count">${state.projects.length}</span></div>`+
  state.categories.sort((a,b)=>(a.order||99)-(b.order||99)).map(c=>`<div class="cat-nav ${state.category===c.id?'active':''}" data-cat="${esc(c.id)}"><span class="cat-icon" style="background:${c.accent||'rgba(255,255,255,.08)'}">${iconHTML(c.icon)}</span><span>${esc(c.name)}</span>${state.site.show_category_counts?`<span class="count">${projectCount(c)}</span>`:""}</div>`).join("");
  $$(".cat-nav").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat||null;state.page="home";render()});
}
function allTags(){return [...new Set(state.projects.flatMap(p=>p.tags||[]))].sort((a,b)=>a.localeCompare(b))}
function renderTags(){
  if(!state.site.features.tag_filters){$("#tagBar").innerHTML="";return}
  $("#tagBar").innerHTML=allTags().map(t=>`<button class="filter-tag ${state.tag===t?'active':''}" data-tag="${esc(t)}">${esc(t)}</button>`).join("");
  $$(".filter-tag").forEach(b=>b.onclick=()=>{state.tag=state.tag===b.dataset.tag?null:b.dataset.tag;render()});
}
function filtered(){
  return state.projects.filter(p=>{
    const q=state.query.trim().toLowerCase();
    const hay=[p.name,p.description,p.long_description,...(p.tags||[]),...(p.technologies||[])].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(!state.category||p.categories?.includes(state.category))&&(!state.tag||p.tags?.includes(state.tag));
  });
}
function projectCard(p){
  const img=p.images?.[0]||`https://placehold.co/1200x675/07152a/169cff?text=${encodeURIComponent(p.name)}`;
  const fav=state.favorites.includes(p.id);
  return `<article class="project-card" data-id="${esc(p.id)}">
    <div class="project-image-wrap"><img class="project-image" src="${esc(img)}" alt="${esc(p.name)}" loading="lazy"></div>
    <div class="project-body">
      <div class="project-name">${esc(p.name)} ${p.featured?'<i class="fa-solid fa-star"></i>':""} ${fav?'<i class="fa-solid fa-heart" style="color:#ff5d8f"></i>':""}</div>
      <div class="project-desc">${esc(p.description)}</div>
      <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
      <div class="project-links">
        ${p.github?`<a class="project-link" href="${esc(p.github)}"${attrs()} onclick="event.stopPropagation()"><i class="fa-brands fa-github"></i> Dépôt</a>`:""}
        ${p.website?`<a class="project-link" href="${esc(p.website)}"${attrs()} onclick="event.stopPropagation()"><i class="fa-solid fa-arrow-up-right-from-square"></i> Site</a>`:""}
      </div>
    </div>
  </article>`;
}
function grid(list,mode=state.view){
  if(!list.length)return '<div class="empty"><i class="fa-regular fa-folder-open"></i><br><br>Aucun projet ne correspond à cette sélection.</div>';
  if(mode==="list")return `<div class="project-list">${list.map(projectCard).join("")}</div>`;
  return `<div class="project-grid ${mode}">${list.map(projectCard).join("")}</div>`;
}
function categorySection(c){
  const list=state.projects.filter(p=>p.categories?.includes(c.id));if(!list.length)return "";
  return `<section class="category-section"><div class="category-header"><span class="cat-icon" style="background:${c.accent||'rgba(255,255,255,.08)'}">${iconHTML(c.icon)}</span><div class="category-title"><h3>${esc(c.name)}</h3><p>${esc(c.description||"")}</p></div><span class="category-count">${list.length} projet${list.length>1?'s':''}</span><div class="scroll-btns"><button class="scroll-btn prev"><i class="fa-solid fa-chevron-left"></i></button><button class="scroll-btn next"><i class="fa-solid fa-chevron-right"></i></button></div></div><div class="category-track">${list.map(projectCard).join("")}</div></section>`;
}
function bindCards(){
  $$(".project-card").forEach(c=>c.onclick=()=>openDetail(c.dataset.id));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("revealed");io.unobserve(e.target)}}),{threshold:.08});
  $$(".project-card").forEach(c=>state.effects.reveal_on_scroll?io.observe(c):c.classList.add("revealed"));
  $$(".category-section").forEach(s=>{const tr=s.querySelector(".category-track"),p=s.querySelector(".prev"),n=s.querySelector(".next");if(p)p.onclick=()=>tr.scrollBy({left:-Math.max(280,tr.clientWidth*.75),behavior:"smooth"});if(n)n.onclick=()=>tr.scrollBy({left:Math.max(280,tr.clientWidth*.75),behavior:"smooth"})});
}
function render(){
  renderNav();renderTags();
  const content=$("#content"),title=$("#pageTitle"),ey=$("#pageEyebrow");
  $("#searchInput").value=state.query;
  if(state.page==="home"){
    title.textContent=state.category?(state.categories.find(c=>c.id===state.category)?.name||"Mes projets"):"Mes projets";ey.textContent=state.category?"CATÉGORIE":"PORTFOLIO";
    content.innerHTML=state.category?grid(filtered()):state.categories.filter(c=>c.show_on_home!==false).sort((a,b)=>(a.order||99)-(b.order||99)).map(categorySection).join("");
  }else if(state.page==="projects"){title.textContent="Tous mes projets";ey.textContent="PROJETS";content.innerHTML=grid(filtered())}
  else if(state.page==="categories"){title.textContent="Catégories";ey.textContent="ORGANISATION";content.innerHTML=state.categories.map(categorySection).join("")}
  else if(state.page==="favorites"){title.textContent="Mes favoris";ey.textContent="FAVORIS";content.innerHTML=grid(state.projects.filter(p=>state.favorites.includes(p.id)))}
  else if(state.page==="about"){title.textContent="À propos";ey.textContent="PROFILE";content.innerHTML=`<section class="category-section"><h3>${esc(state.profile.display_name)}</h3><p class="project-desc" style="font-size:13px;min-height:0">${esc(state.profile.bio)}</p><div class="tags">${(state.profile.quick_tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div><a class="project-link" style="display:inline-block;width:auto" href="${esc(state.profile.profile_link)}"${attrs()}><i class="fa-brands fa-github"></i> Voir mon GitHub</a></section>`}
  else {title.textContent="Documentation";ey.textContent="DOCS";content.innerHTML=renderDocs()}
  bindCards();window.scrollTo({top:0,behavior:"smooth"});
}
function renderDocs(){
  const ds=state.docs.documents||[];return `<section class="category-section"><div class="detail-section"><h3>Documentation</h3><p class="project-desc" style="font-size:12px;min-height:0">Les documents sont déclarés dans <code>config/docs.json</code> et peuvent être des fichiers Markdown locaux.</p><div class="related-grid">${ds.map(d=>`<div class="related-item" data-doc="${esc(d.path)}"><i class="fa-regular fa-file-lines"></i> ${esc(d.title)}<small style="display:block;color:#718da5;margin-top:5px">${esc(d.category||"")}</small></div>`).join("")}</div></div></section>`;
}
async function openDoc(path){
  try{const txt=await fetch(path).then(r=>r.text());$("#detailContent").innerHTML=`<div class="detail-body"><div class="md">${window.marked?marked.parse(txt):esc(txt).replace(/\n/g,"<br>")}</div></div>`;$("#detailModal").classList.add("open")}catch(e){toast("Impossible de charger le document")}
}
function openDetail(id){
  const p=state.projects.find(x=>x.id===id);if(!p)return;
  const cats=p.categories?.map(x=>state.categories.find(c=>c.id===x)?.name).filter(Boolean)||[];
  const related=(p.related||[]).map(id=>state.projects.find(x=>x.id===id)).filter(Boolean);
  $("#detailContent").innerHTML=`<div class="detail-hero"><img src="${esc(p.images?.[0]||"https://placehold.co/1200x675/07152a/169cff?text=Project")}" alt=""></div>
  <div class="detail-body"><div class="eyebrow">${esc(p.status||"PROJECT")}</div><h2 class="detail-title">${esc(p.name)}</h2>
  <div class="detail-meta">${cats.map(x=>`<span class="badge">${esc(x)}</span>`).join("")}${(p.technologies||[]).map(x=>`<span class="badge">${esc(x)}</span>`).join("")}${p.year?`<span class="badge">${esc(p.year)}</span>`:""}</div>
  <div class="detail-grid"><div><p class="detail-description">${esc(p.long_description||p.description)}</p>
  <div class="gallery-thumbs">${(p.images||[]).map((x,i)=>`<img class="gallery-thumb" data-i="${i}" src="${esc(x)}" alt="">`).join("")}</div>
  ${p.docs?.length?`<div class="detail-section"><h4>Documentation</h4>${p.docs.map(d=>`<div class="related-item doc-link" data-doc="${esc(d)}">${esc(d)}</div>`).join("")}</div>`:""}
  ${related.length?`<div class="detail-section"><h4>Projets liés</h4><div class="related-grid">${related.map(r=>`<div class="related-item" data-related="${esc(r.id)}">${esc(r.name)}</div>`).join("")}</div></div>`:""}</div>
  <aside><div class="detail-section"><h4>GitHub</h4>${state.site.features.github_badges&&p.github?`<div><img style="max-width:100%" src="https://img.shields.io/github/stars/${repoPath(p.github)}?style=flat-square&label=stars"><br><img style="max-width:100%;margin-top:5px" src="https://img.shields.io/github/last-commit/${repoPath(p.github)}?style=flat-square&label=last+commit"><br><img style="max-width:100%;margin-top:5px" src="https://img.shields.io/github/license/${repoPath(p.github)}?style=flat-square&label=license"></div>`:""}<div class="detail-actions">
  ${p.github?`<a class="detail-action primary" href="${esc(p.github)}"${attrs()}><i class="fa-brands fa-github"></i> Dépôt GitHub</a>`:""}${p.website?`<a class="detail-action" href="${esc(p.website)}"${attrs()}><i class="fa-solid fa-globe"></i> Site Web</a>`:""}
  <button class="detail-action" id="favBtn">${state.favorites.includes(p.id)?"★ Retirer des favoris":"☆ Ajouter aux favoris"}</button><button class="detail-action" id="shareBtn">↗ Partager</button><button class="detail-action" id="copyBtn">⧉ Copier le lien</button></div></div></aside></div></div>`;
  $("#detailModal").classList.add("open");
  $$(".gallery-thumb").forEach(t=>t.onclick=()=>openGallery(p,+t.dataset.i));
  $$(".doc-link").forEach(x=>x.onclick=()=>openDoc(x.dataset.doc));
  $$(".related-item[data-related]").forEach(x=>x.onclick=()=>openDetail(x.dataset.related));
  $("#favBtn").onclick=()=>toggleFavorite(p.id);
  $("#shareBtn").onclick=()=>shareProject(p);
  $("#copyBtn").onclick=()=>copyProject(p);
}
function repoPath(url){try{const u=new URL(url);return u.pathname.replace(/^\/|\/$/g,"")}catch{return""}}
function openGallery(p,i){state.galleryProject=p;state.galleryIndex=i;updateGallery();$("#galleryModal").classList.add("open")}
function updateGallery(){const p=state.galleryProject,imgs=p.images||[];if(!imgs.length)return;state.galleryIndex=(state.galleryIndex+imgs.length)%imgs.length;$("#galleryImage").src=imgs[state.galleryIndex];$("#galleryCaption").textContent=`${p.name} — ${state.galleryIndex+1} / ${imgs.length}`}
function toggleFavorite(id){state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];localStorage.setItem("nexgenFavorites",JSON.stringify(state.favorites));toast(state.favorites.includes(id)?"Ajouté aux favoris":"Retiré des favoris");openDetail(id);render()}
async function shareProject(p){const url=location.href.split("#")[0]+"#project/"+p.id;if(navigator.share)try{await navigator.share({title:p.name,url})}catch{}else{await navigator.clipboard?.writeText(url);toast("Lien copié")}}
async function copyProject(p){const url=location.href.split("#")[0]+"#project/"+p.id;try{await navigator.clipboard.writeText(url);toast("Lien du projet copié")}catch{toast(url)}}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>x.classList.remove("show"),2200)}
function renderThemes(){const active=localStorage.getItem("nexgenTheme")||state.theme.active;$("#themeChoices").innerHTML=Object.entries(state.theme.themes).map(([id,t])=>`<button class="theme-choice ${id===active?'active':''}" data-theme="${esc(id)}">${esc(t.label||id)}</button>`).join("");$$(".theme-choice").forEach(b=>b.onclick=()=>{applyTheme(b.dataset.theme);renderThemes();toast("Thème appliqué")})}
async function runImport(){
  const user=$("#importUsername").value.trim()||state.githubImport.username;$("#importStatus").textContent="Chargement...";
  try{
    const url=state.githubImport.endpoint.replace("{username}",encodeURIComponent(user));
    const repos=await fetch(url,{headers:{"Accept":"application/vnd.github+json"}}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()});
    state.imported=repos.filter(r=>(state.githubImport.include_forks||!r.fork)&&(state.githubImport.include_archived||!r.archived));
    $("#importStatus").textContent=`${state.imported.length} dépôt(s) trouvé(s).`;
    $("#importResults").innerHTML=state.imported.map((r,i)=>`<label class="import-row"><input type="checkbox" data-import="${i}" checked><span><b>${esc(r.name)}</b><br><small>${esc(r.description||"Sans description")}</small></span><small>${r.stargazers_count} ★</small></label>`).join("");
    $("#exportImported").disabled=false;
  }catch(e){$("#importStatus").textContent="Erreur : "+e.message}
}
function exportImported(){
  const chosen=$$(".import-row input:checked").map(x=>state.imported[+x.dataset.import]);
  const out={projects:chosen.map(r=>({id:r.name.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:r.name,categories:[state.githubImport.auto_category],description:r.description||"",long_description:r.description||"",images:[state.githubImport.image_template.replace("{full_name}",r.full_name)],tags:[...(r.topics||[]),...(r.language?[r.language]:[])],github:r.html_url,website:r.homepage||"",featured:false,status:r.archived?"Archived":"Active",year:r.updated_at?.slice(0,4)||"",related:[],technologies:r.language?[r.language]:[]}))};
  const blob=new Blob([JSON.stringify(out,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="projects-imported.json";a.click();URL.revokeObjectURL(a.href);toast("JSON exporté")
}
function route(){
  const h=location.hash.replace(/^#/,"");
  if(h.startsWith("project/")){openDetail(h.split("/")[1]);return}
  if(h.startsWith("category/")){state.category=h.split("/")[1];state.page="home";return}
  if(h==="projects"||h==="categories"||h==="favorites"||h==="about"||h==="documentation")state.page=h;else state.page="home";
}
function bind(){
  $("#searchInput").oninput=e=>{state.query=e.target.value;render()};$("#clearSearch").onclick=()=>{state.query="";render()};
  $("#themeBtn").onclick=()=>{$("#themePanel").classList.add("open");renderThemes()};$("#importBtn").onclick=()=>{$("#importPanel").classList.add("open");$("#importUsername").value=state.githubImport.username};
  $("#runImport").onclick=runImport;$("#exportImported").onclick=exportImported;
  $$(".close-drawer").forEach(b=>b.onclick=()=>b.closest(".drawer").classList.remove("open"));
  $(".modal-close").onclick=()=>$("#detailModal").classList.remove("open");$(".gallery-close").onclick=()=>$("#galleryModal").classList.remove("open");
  $("#galleryModal .prev").onclick=()=>{state.galleryIndex--;updateGallery()};$("#galleryModal .next").onclick=()=>{state.galleryIndex++;updateGallery()};
  $$(".view-btn").forEach(b=>b.onclick=()=>{state.view=b.dataset.viewMode;$$(".view-btn").forEach(x=>x.classList.toggle("active",x===b));render()});
  $("#mobileMenu").onclick=()=>$("#sidebar").classList.toggle("open");
  document.addEventListener("click",e=>{const d=e.target.closest(".doc-link");if(d)openDoc(d.dataset.doc)});
  if(state.effects.cursor_glow&&!matchMedia("(prefers-reduced-motion:reduce)").matches){const g=$("#cursorGlow");addEventListener("pointermove",e=>{g.style.left=e.clientX+"px";g.style.top=e.clientY+"px"})}else $("#cursorGlow").style.display="none";
  if(state.effects.parallax_hero&&!matchMedia("(prefers-reduced-motion:reduce)").matches){addEventListener("scroll",()=>{$(".hero-image").style.transform=`translateY(${scrollY*.12}px)`},{passive:true})}
  addEventListener("hashchange",()=>{route();render()});
}
(async()=>{try{await load();const saved=localStorage.getItem("nexgenTheme");applyTheme(saved||state.theme.active);renderProfile();bind();route();render();$("#footer").textContent=state.site.footer_text;document.title=state.site.title}catch(e){document.body.innerHTML=`<div style="padding:40px;color:white;font-family:system-ui;background:#020814;min-height:100vh"><h1>Erreur de configuration</h1><p>Impossible de charger un fichier JSON.</p><pre>${esc(e.message)}</pre></div>`}})();
