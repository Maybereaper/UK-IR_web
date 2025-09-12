// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle functionality
  const themeToggleInput = document.getElementById('theme-toggle-input');
  
  if (themeToggleInput) {
    
    // Get saved theme or default to light
    function getInitialTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      // Check system preference but don't auto-apply it
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply theme to document
    function applyTheme(theme) {
      console.log('Applying theme:', theme); // Debug log
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleInput.checked = true;
      } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggleInput.checked = false;
      }
    }
    
    // Toggle theme
    function toggleTheme() {
      const newTheme = themeToggleInput.checked ? 'dark' : 'light';
      console.log('Toggling to', newTheme); // Debug log
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }
    
    // Initialize theme - default to light if no preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'light'; // Default to light mode
    console.log('Initial theme:', initialTheme); // Debug log
    applyTheme(initialTheme);
    
    // Add event listener to theme toggle
    themeToggleInput.addEventListener('change', toggleTheme);
    
    // Optional: Listen for system theme changes only if no manual preference is set
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

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

  // Toast notification system
  function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close">×</button>
    `;

    container.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove
    const autoRemove = setTimeout(() => {
      removeToast(toast);
    }, duration);

    // Manual close
    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(autoRemove);
      removeToast(toast);
    });
  }

  function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }

  // Scroll reveal animation
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Search and filter functionality
  let allEvents = [];
  let filteredEvents = [];

  function initEventControls() {
    const searchInput = document.getElementById('event-search');
    const prizeFilter = document.getElementById('prize-filter');
    const clearButton = document.getElementById('clear-filters');

    if (searchInput) {
      searchInput.addEventListener('input', filterEvents);
    }
    if (prizeFilter) {
      prizeFilter.addEventListener('change', filterEvents);
    }
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (prizeFilter) prizeFilter.value = '';
        filterEvents();
        showToast('Filters cleared', 'success');
      });
    }
  }

  function filterEvents() {
    const searchTerm = document.getElementById('event-search')?.value.toLowerCase() || '';
    const minPrize = parseInt(document.getElementById('prize-filter')?.value || '0');

    filteredEvents = allEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                           event.description.toLowerCase().includes(searchTerm);
      const prizeValue = parseInt(event.prize.replace(/\D/g, '')) || 0;
      const matchesPrize = minPrize === 0 || prizeValue >= minPrize;
      
      return matchesSearch && matchesPrize;
    });

    renderEvents(filteredEvents);
    
    const noEventsDiv = document.getElementById('no-events');
    if (noEventsDiv) {
      noEventsDiv.style.display = filteredEvents.length === 0 ? 'block' : 'none';
    }
  }

  // Discord member count (mock implementation)
  async function updateDiscordStats() {
    const memberCountEl = document.getElementById('member-count');
    if (!memberCountEl) return;

    try {
      // This is a mock implementation. For real Discord integration,
      // you'd need a Discord bot and API endpoint
      const mockMemberCount = Math.floor(Math.random() * 50) + 150; // Mock: 150-200 members
      memberCountEl.textContent = mockMemberCount;
      
      // Update every 30 seconds with slight variations
      setTimeout(() => {
        const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
        const newCount = Math.max(120, mockMemberCount + variation);
        memberCountEl.textContent = newCount;
      }, 30000);
      
    } catch (error) {
      console.log('Discord stats unavailable');
      memberCountEl.textContent = '180+';
    }
  }

  // Enhanced events loading with search support
  async function loadEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    // Show skeleton loading
    grid.innerHTML = `
      <div class="event-card skeleton-card skeleton"></div>
      <div class="event-card skeleton-card skeleton"></div>
      <div class="event-card skeleton-card skeleton"></div>
    `;

    try {
      const res = await fetch('assets/data/events.json');
      const events = await res.json();
      allEvents = events;
      filteredEvents = events;
      
      setTimeout(() => {
        renderEvents(events);
        showToast('Events loaded successfully!', 'success');
      }, 800); // Simulate loading time for better UX
      
    } catch (err) {
      console.error("Couldn't load events:", err);
      grid.innerHTML = '<p>Unable to load events. Please try again later.</p>';
      showToast('Failed to load events', 'error');
    }
  }

  // Enhanced render events with animations
  function renderEvents(events) {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    events.forEach((ev, index) => {
      const card = document.createElement('article');
      card.className = 'event-card fade-in-up';
      card.style.animationDelay = `${index * 0.1}s`;
      
      card.innerHTML = `
        <h4>${ev.title}</h4>
        <div class="event-meta">${ev.date} • Prize: ${ev.prize}</div>
        <p>${ev.description}</p>
        <div class="event-actions">
          <a class="btn btn-primary" href="${ev.link}" onclick="showToast('Opening Discord...', 'info')">Register</a>
          <a class="btn btn-ghost" href="${ev.link}">Details</a>
        </div>
      `;
      
      grid.appendChild(card);
    });
  }

  // Initialize all features
  initScrollReveal();
  initEventControls();
  updateDiscordStats();
  
  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration.scope);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }

  // Welcome message
  setTimeout(() => {
    showToast('Welcome to UK-IR PUBG Community! 🎮', 'success');
  }, 2000);
});
 