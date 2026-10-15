const ICONS={
arr:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
arrl:'<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
chev:'<path d="m9 18 6-6-6-6"/>',
down:'<path d="m6 9 6 6 6-6"/>',
search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
drop:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
flask:'<path d="M9 3h6"/><path d="M10 9V3h4v6l5 9a2 2 0 0 1-1.7 3H6.7A2 2 0 0 1 5 18z"/><path d="M7 15h10"/>',
layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
tag:'<path d="M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l8.6-8.6a1 1 0 0 0 0-1.4z"/><circle cx="7" cy="7" r="1.5"/>',
file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
dl:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
book:'<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
bookf:'<path fill="currentColor" d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
minus:'<path d="M5 12h14"/>',
info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
micro:'<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
pulse:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
dna:'<path d="M2 15c6.7-6 13.3 0 20-6"/><path d="M9 22c1.8-2 2.9-4.3 3.3-6.7"/><path d="M15 2c-1.8 2-2.9 4.3-3.3 6.7"/><path d="M17 6l-2.5-2.5"/><path d="M14 8 11 5"/><path d="m7 18 2.5 2.5"/><path d="m10 16 3 3"/><path d="M2 9c6.7 6 13.3 0 20 6"/>',
users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
spark:'<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z"/>',
list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
cpu:'<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h8"/>',
link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
scale:'<path d="M12 3v18M5 21h14M3 7h18"/><path d="m6 7-3 7a3 3 0 0 0 6 0z"/><path d="m18 7-3 7a3 3 0 0 0 6 0z"/>',
home:'<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
up:'<path d="m18 15-6-6-6 6"/>',
};
function ic(n,c=''){return `<svg class="i ${c}" viewBox="0 0 24 24">${ICONS[n]||''}</svg>`}
document.querySelectorAll('[data-i]').forEach(e=>{e.outerHTML=ic(e.dataset.i,e.className)});
const active=document.body.dataset.nav||'';
const NAV=[['diag','Diagnostik',1],['epi','Epigenetik'],['igloo','IglooPro'],['blog','Blog'],['events','Termine'],['about','Über uns'],['support','Support']];
const h=document.getElementById('hdr');
if(h)h.outerHTML=`<header class="hdr"><div class="wrap bar"><a class="logo" href="#"><img src="img/polaris_white.webp" alt="PolarisDX"></a>
<nav>${NAV.map(([k,l,d])=>`<a class="${k===active?'on':''}">${l}${d?ic('down','s'):''}</a>`).join('')}</nav>
<div class="r"><span class="ic">${ic('search')}</span><span class="lang"><i class="flag"></i>DE ${ic('down','s')}</span><a class="btn">Angebot anfragen</a><span class="ic burger">${ic('menu')}</span></div></div></header>`;
const f=document.getElementById('ftr');
if(f)f.outerHTML=`<footer class="ftr"><div class="wrap"><div class="g">
<div><img src="img/polaris_white.webp" style="height:30px;margin-bottom:16px"><p style="color:rgba(255,255,255,.7);font-size:14px;max-width:280px">Ihr Partner für Point-of-Care-Diagnostik. Laborpräzise Sofortdiagnostik für Dental, Beauty und Longevity.</p></div>
<div><h5>Diagnostik</h5><ul><li>Alle Bereiche</li><li>Dental</li><li>Beauty</li><li>Longevity</li><li>Weitere 6 Bereiche</li></ul></div>
<div><h5>Epigenetik</h5><ul><li>Überblick &amp; Analysen</li><li>Grundlagen</li><li>Musterbefunde</li><li>Studienlage</li><li>Unterlagen</li></ul></div>
<div><h5>Produkt &amp; Wissen</h5><ul><li>IglooPro</li><li>Blog</li><li>Downloads</li><li>Termine</li></ul></div>
<div><h5>Unternehmen</h5><ul><li>Über uns</li><li>Kontakt</li><li>Support</li><li>London · Hamburg</li></ul></div>
</div><div class="bot"><div>© PolarisDX 2026</div><span><a>Impressum</a><a>Datenschutz</a><a>AGB</a><a>Cookie-Einstellungen</a></span></div></div></footer>`;
const ring=`<svg viewBox="0 0 88.4 88.4"><g fill="#8fd8fb"><circle cx="35.42" cy="8.25" r="6.41"/><circle cx="80.34" cy="35.84" r="6.41"/><circle cx="52.86" cy="80.3" r="6.38"/><circle cx="7.81" cy="52.73" r="6.26"/><circle cx="11.11" cy="37.52" r="5.2"/><circle cx="11.08" cy="67.64" r="5.2"/><circle cx="77.04" cy="50.88" r="5.2"/><circle cx="37.7" cy="77.02" r="5.17"/><circle cx="67.7" cy="77.02" r="5.17"/><circle cx="20.6" cy="16.6" r="5.2"/><circle cx="51.5" cy="11.2" r="5.2"/><circle cx="68.2" cy="17.2" r="5.2"/><circle cx="21.2" cy="80.2" r="4"/><circle cx="83.6" cy="64" r="4"/><circle cx="66.6" cy="3.6" r="3.4"/><circle cx="4.6" cy="22" r="3.4"/></g></svg>`;
document.querySelectorAll('.ring').forEach(e=>e.innerHTML=ring);
if(new URLSearchParams(location.search).has('notes'))document.body.classList.add('notes');
document.querySelectorAll('[data-note]').forEach(e=>{const n=document.createElement('span');n.className='note';n.textContent=e.dataset.note;const [x,y]=(e.dataset.at||'-12,-12').split(',');n.style.left=x+'px';n.style.top=y+'px';if(getComputedStyle(e).position==='static')e.style.position='relative';e.appendChild(n)});
