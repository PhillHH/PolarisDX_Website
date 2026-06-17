/* Shared wireframe chrome — injects identical Header / CTA / Footer / globals
   into every page so the 18 frames stay consistent.
   Requires the folder to be served (the recommended html.to.design workflow:
   import by URL). `npx serve wireframes` then open each page.

   Per-page <body> data attributes:
     data-wf-title  → frame label text
     data-wf-route  → route shown on the frame label
     data-wf-nocta  → present on Contact/Support (no overlapping CTA card)
*/
;(function () {
  function el(html) {
    const t = document.createElement('template')
    t.innerHTML = html.trim()
    return t.content.firstChild
  }

  const title = document.body.dataset.wfTitle || 'Seite'
  const route = document.body.dataset.wfRoute || '/'
  const noCta = document.body.hasAttribute('data-wf-nocta')

  const frame = el(
    '<div class="wf-frame-label"><span>WF · ' +
      title +
      '</span><span class="route">' +
      route +
      '</span></div>',
  )

  const header = el(`
    <header class="wf-header">
      <div class="wf-header-inner">
        <div class="wf-logo">LOGO</div>
        <nav>
          <a href="home.html">Home</a>
          <a href="events.html">Events</a>
          <a href="about.html">Über uns <span class="caret">▾</span></a>
          <a href="diagnostics.html">Diagnostik <span class="caret">▾</span></a>
          <a href="articles.html">Blog</a>
          <a href="support.html">Support</a>
        </nav>
        <div class="wf-header-right">
          <div class="wf-icon wf-icon--sm">Q</div>
          <span class="lang">DE ▾</span>
          <a class="wf-btn" href="contact.html">Kontakt</a>
        </div>
      </div>
    </header>`)

  const cta = el(`
    <div class="wf-cta-wrap">
      <div class="wf-cta-card">
        <div class="wf-img" style="height:170px"><span>Avatar</span></div>
        <div class="wf-stack">
          <div class="wf-h2" style="color:#fff">Bereit für präzise Point-of-Care Diagnostik?</div>
          <div class="wf-lines l2" style="max-width:48ch"></div>
          <div><a class="wf-btn">Demo anfragen</a></div>
        </div>
      </div>
    </div>`)

  const footer = el(`
    <footer class="wf-footer">
      <div class="wf-container">
        <div class="wf-footer-top">
          <div class="wf-footer-brand">
            <div class="wf-logo">LOGO</div>
            <div class="wf-lines l2" style="max-width:34ch"></div>
            <div class="wf-social"><div class="wf-icon wf-icon--sm">in</div><div class="wf-icon wf-icon--sm">ig</div></div>
          </div>
          <div class="wf-footer-cols">
            <div><h4>Links</h4><ul><li><a>Home</a></li><li><a>Über uns</a></li><li><a>IglooPro</a></li><li><a>Blog</a></li><li><a>Events</a></li><li><a>Downloads</a></li><li><a>Kontakt</a></li></ul></div>
            <div><h4>Diagnostik</h4><ul><li><a>Alle Services</a></li><li><a>Dental</a></li><li><a>Beauty</a></li><li><a>Longevity</a></li><li><a>POC-Systeme</a></li><li><a>Präventions-Checks</a></li><li><a>Hormon-Tests</a></li></ul></div>
            <div><h4>London</h4><p>PolarisDX LTD</p><p>262A Fulham Road</p><p>London SW10 9EL</p><p>+44 7879 433019</p><p>contact@polarisdx.net</p></div>
            <div><h4>Hamburg</h4><p>PolarisDX Europe GmbH</p><p>Große Bleichen 1–3</p><p>20354 Hamburg</p><p>contact@polarisdx.net</p></div>
          </div>
        </div>
        <div class="wf-footer-bottom"><span>© PolarisDX 2026 — All Rights Reserved.</span><a>Impressum</a><a>Datenschutzerklärung</a><a>AGB</a></div>
        <div class="wf-footer-fine">IglooPro ist ein Produkt der DX365 GmbH</div>
      </div>
    </footer>`)

  const chat = el('<div class="wf-chat">CHAT</div>')

  document.body.insertBefore(header, document.body.firstChild)
  document.body.insertBefore(frame, header)
  if (!noCta) document.body.appendChild(cta)
  document.body.appendChild(footer)
  document.body.appendChild(chat)
})()
