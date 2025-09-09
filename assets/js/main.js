// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // nav toggle
  const navToggle = document.getElementById('nav-toggle');
  navToggle?.addEventListener('click', () => {
    const html = document.documentElement;
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    html.classList.toggle('nav-open');
  });

  // events loader
  async function loadEvents() {
    try {
      const res = await fetch('assets/data/events.json');
      const events = await res.json();
      renderEvents(events);
    } catch (err) {
      console.error("Couldn't load events:", err);
    }
  }

  function renderEvents(events) {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    events.forEach(ev => {
      const card = document.createElement('article');
      card.className = 'event-card';
      card.innerHTML = `
        <h4>${ev.title}</h4>
        <div class="event-meta">${ev.date} • Prize: ${ev.prize}</div>
        <p>${ev.description}</p>
        <div class="event-actions">
          <a class="btn btn-primary" href="${ev.link}">Register</a>
          <a class="btn btn-ghost" href="${ev.link}">Details</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  loadEvents();
});
 