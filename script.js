/* ============================================================
   ARS Prime Technical Services — Script
   Features: Scroll animations, navbar, theme toggle, mobile nav, form
   ============================================================ */

'use strict';

// ── Theme Toggle ────────────────────────────────────────────
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;
  const icon = btn.querySelector('.theme-icon');

  const saved = localStorage.getItem('ars-theme') || 'light';
  html.setAttribute('data-theme', saved);
  icon.textContent = saved === 'dark' ? '☀' : '☾';

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    icon.textContent = next === 'dark' ? '☀' : '☾';
    localStorage.setItem('ars-theme', next);
  });
})();

// ── Navbar Scroll Effect ────────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (y > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = y;
  }, { passive: true });
})();

// ── Mobile Nav (Hamburger) ──────────────────────────────────
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
})();

// ── Scroll Reveal Animations ────────────────────────────────
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-right');

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  targets.forEach(el => observer.observe(el));
})();

// ── Active Nav Link on Scroll ───────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, {
    threshold: 0.35
  });

  sections.forEach(sec => observer.observe(sec));
})();

// ── Contact Form Handler ────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');

    // Prepare API payload with formatted email content (HTML)
    const emailBody = `Hello,<br><br>You have received a new inquiry through your website contact form. Here are the details:<br><br><strong>Full Name:</strong> ${name}<br><strong>Email Address:</strong> ${email}<br><strong>Service Interest:</strong> ${service || 'Not specified'}<br><br><strong>Message:</strong><br>${message}<br><br>---<br><br>Please reach out to the customer at your earliest convenience to follow up on this inquiry.<br><br>Best regards,<br>Your Website Contact Form`;

    const payload = {
      to: ['info@arstechnicals.com'],
      subject: 'New Inquiry from A R SPrime Technical website.',
      body: emailBody
    };

    try {
      // Use CORS proxy to bypass CORS restrictions
      const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://athulapp.azurewebsites.net/api/Email/send-email');
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        successMsg.classList.add('show');
        form.reset();
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      } else {
        console.error('Failed to send email:', response.statusText);
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      btn.textContent = 'Send Inquiry';
      btn.disabled = false;
    }
  });
})();

// ── Smooth scroll for all anchor links ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Subtle parallax on hero orbs ───────────────────────────
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.08;
          orb.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── Number counter animation ────────────────────────────────
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        // Extract numeric part
        const match = text.match(/(\d+)/);
        if (!match) return;

        const target = parseInt(match[1]);
        const suffix = text.replace(/\d+/, '').trim();
        let current = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.innerHTML = current + '<span class="stat-sym">' + suffix + '</span>';
          if (current >= target) clearInterval(interval);
        }, 30);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();

// ── Cursor glow effect (desktop only) ──────────────────────
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,210,200,0.04), transparent 70%);
    transform: translate(-50%,-50%);
    transition: opacity 0.3s;
    left: -9999px; top: -9999px;
  `;
  document.body.appendChild(glow);

  let visible = false;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    if (!visible) {
      glow.style.opacity = '1';
      visible = true;
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    visible = false;
  });
})();
