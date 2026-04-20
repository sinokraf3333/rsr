/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  follower.style.left = mouseX + 'px';
  follower.style.top = mouseY + 'px';
});

// Hover expand on links/buttons
const interactives = document.querySelectorAll('a, button, .work-card, .skill-tag');
interactives.forEach(el => {
  el.addEventListener('mouseenter', () => {
    follower.style.width = '60px';
    follower.style.height = '60px';
    follower.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.width = '36px';
    follower.style.height = '36px';
    follower.style.opacity = '0.5';
  });
});

/* ===== SCROLLED NAV ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ===== REVEAL ON SCROLL ===== */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 100);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => observer.observe(el));

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ===== WORK CARD HOVER TILT ===== */
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
    card.querySelector('.work-card-inner').style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.work-card-inner').style.transform = '';
  });
});

/* ===== HERO NAME SPLIT TEXT EFFECT ===== */
window.addEventListener('load', () => {
  const heroItems = document.querySelectorAll('.hero .reveal');
  heroItems.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });
});
