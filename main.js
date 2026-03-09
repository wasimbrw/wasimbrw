/* ══════════════════════════════════════════
   VIBE CODER PORTFOLIO — main.js
   Muhammad Wasim | 2025
   ══════════════════════════════════════════ */

'use strict';

// ── Navbar Scroll Effect ──
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile Nav Toggle ──
const navToggle = document.getElementById('navToggle');
navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('open');
});

// ── Particle Canvas ──
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, animId;

  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  const randomBetween = (a, b) => a + Math.random() * (b - a);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = randomBetween(0, W);
      this.y = randomBetween(0, H);
      this.r = randomBetween(0.5, 2);
      this.vx = randomBetween(-0.2, 0.2);
      this.vy = randomBetween(-0.4, -0.1);
      this.alpha = randomBetween(0.2, 0.7);
      const palette = ['#8b5cf6', '#6366f1', '#ec4899', '#22d3ee', '#a78bfa'];
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create 80 particles
  for (let i = 0; i < 80; i++) particles.push(new Particle());

  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(tick);
  };
  tick();
}

// ── Intersection Observer — Card Animations ──
const observeElements = (selector, className = 'visible', options = {}) => {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add(className);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, ...options });
  els.forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    obs.observe(el);
  });
};

// Add fade-in style dynamically
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .service-card, .project-card, .review-card, .tl-item {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, background 0.25s, box-shadow 0.25s;
  }
  .service-card.visible, .project-card.visible, .review-card.visible, .tl-item.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(fadeStyle);

document.addEventListener('DOMContentLoaded', () => {
  observeElements('.service-card');
  observeElements('.project-card');
  observeElements('.review-card');
  observeElements('.tl-item');
});

// ── Smooth Scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile nav
      navToggle?.classList.remove('open');
    }
  });
});

// ── Contact Form Handler ──
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const name = form.elements['name'].value.trim();
  const email = form.elements['email'].value.trim();
  const service = form.elements['service'].value;
  const message = form.elements['message'].value.trim();

  // Build mailto link
  const subject = encodeURIComponent(`Portfolio Inquiry: ${service || 'General'}`);
  const body = encodeURIComponent(
    `Hi Muhammad Wasim,\n\nName: ${name}\nEmail: ${email}\nService: ${service || 'Not specified'}\n\nMessage:\n${message}\n\nSent from your portfolio website.`
  );
  const mailtoUrl = `mailto:waseem_raza3@yahoo.com?subject=${subject}&body=${body}`;

  // Button feedback
  const span = btn.querySelector('span');
  const originalText = span.textContent;
  span.textContent = 'Opening Email...';
  btn.disabled = true;
  btn.style.opacity = '0.8';

  window.location.href = mailtoUrl;

  setTimeout(() => {
    span.textContent = '✓ Message Ready!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      span.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.background = '';
      form.reset();
    }, 2500);
  }, 800);
}

// ── Review Modal Handler ──
const reviewModal = document.getElementById('reviewModal');
const openReviewBtn = document.getElementById('openReviewBtn');
const closeReviewBtn = document.getElementById('closeReviewBtn');

if (openReviewBtn && reviewModal && closeReviewBtn) {
  openReviewBtn.addEventListener('click', () => {
    reviewModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  });

  const closeModal = () => {
    reviewModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeReviewBtn.addEventListener('click', closeModal);
  reviewModal.addEventListener('click', (e) => {
    if (e.target === reviewModal) closeModal();
  });
}

// ── Star Rating Logic ──
const stars = document.querySelectorAll('#starRating span');
const ratingInput = document.getElementById('revRating');

stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    ratingInput.value = star.dataset.value;
    updateStars(index);
  });

  // Optional hover effect
  star.addEventListener('mouseenter', () => updateStars(index));
  star.parentElement.addEventListener('mouseleave', () => {
    updateStars(ratingInput.value - 1);
  });
});

function updateStars(activeIndex) {
  stars.forEach((s, i) => {
    if (i <= activeIndex) {
      s.style.color = '#8b5cf6'; // var(--accent)
    } else {
      s.style.color = '#64748b'; // var(--text-3)
    }
  });
}
// Init stars
updateStars(4); // Default to 5 stars (index 4)

// ── Review Form Submission ──
function handleReviewSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitReviewBtn');

  const name = document.getElementById('revName').value.trim();
  const role = document.getElementById('revRole').value.trim();
  const rating = document.getElementById('revRating').value;
  const message = document.getElementById('revMessage').value.trim();

  const subject = encodeURIComponent(`New Portfolio Review from ${name}`);
  const body = encodeURIComponent(
    `Hi Muhammad Wasim,\n\nYou received a new review for your portfolio!\n\nName: ${name}\nRole: ${role}\nRating: ${rating} Stars\n\nReview:\n"${message}"\n\nYou can now add this to your website's hardcoded HTML.`
  );

  const mailtoUrl = `mailto:waseem_raza3@yahoo.com?subject=${subject}&body=${body}`;

  const span = btn.querySelector('span');
  const originalText = span.textContent;
  span.textContent = 'Opening Email...';
  btn.disabled = true;

  window.location.href = mailtoUrl;

  setTimeout(() => {
    span.textContent = '✓ Review Ready!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      span.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
      updateStars(4); // Reset to 5 stars
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    }, 2500);
  }, 800);
}

// ── Avatar fallback if image fails ── 
const avatar = document.getElementById('heroAvatar');
if (avatar) {
  avatar.addEventListener('error', () => {
    avatar.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.style.cssText = `
      width:320px;height:320px;border-radius:50%;
      background:linear-gradient(135deg,#8b5cf6,#6366f1);
      display:flex;align-items:center;justify-content:center;
      font-size:5rem;font-family:system-ui;
      border:2px solid rgba(139,92,246,0.4);
    `;
    fallback.textContent = '👨‍💻';
    avatar.parentNode.insertBefore(fallback, avatar);
  });
}

// ── Active nav link highlighting ──
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');
const highlightNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinkEls.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#fff' : '';
    a.style.background = a.getAttribute('href') === `#${current}` ? 'rgba(139,92,246,0.15)' : '';
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });
